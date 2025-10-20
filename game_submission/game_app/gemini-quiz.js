/**
 * Gemini AI Quiz Generation Service (Frontend)
 * 
 * Generates age-appropriate educational quiz questions using Google's Gemini API
 * with built-in content moderation for teenagers (ages 13-18).
 */

class GeminiQuizService {
    constructor() {
        this.apiKey = CONFIG.GEMINI_API_KEY;
        this.endpoint = CONFIG.API.GEMINI_ENDPOINT;
        
        // Age-appropriate system prompt
        this.systemPrompt = `You are an educational content generator for teenagers (ages 13-18).

Your task is to generate educational, age-appropriate, and respectful multiple-choice quiz questions about:
- Sexual health education
- Mental health awareness
- Healthy relationships
- Personal well-being

IMPORTANT REQUIREMENTS:
1. Use factual, medically accurate information
2. Be respectful and non-judgmental
3. Use age-appropriate language (suitable for teenagers 13-18)
4. Avoid explicit or graphic content
5. Focus on education, safety, and health
6. Include supportive, empowering explanations
7. Promote healthy decision-making
8. Be inclusive and culturally sensitive

CONTENT GUIDELINES:
✅ DO include: prevention, health facts, emotional support, decision-making skills, consent, healthy boundaries
❌ DO NOT include: explicit descriptions, inappropriate imagery, judgmental language, misinformation

Each question MUST follow this EXACT JSON structure:
{
  "question": "Clear question text",
  "answers": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correct": 0,
  "explanation": "Educational explanation why this is correct and why it matters"
}

Return ONLY a valid JSON array of questions. No additional text or markdown formatting.`;

        // Inappropriate keywords for filtering
        this.inappropriateKeywords = [
            'explicit', 'graphic', 'pornographic', 'sexually explicit',
            'self-harm', 'suicide method', 'how to hurt',
            'racial slur', 'hate speech', 'discriminatory'
        ];
        
        // Required educational keywords
        this.educationalKeywords = [
            'health', 'education', 'prevention', 'consent', 'boundaries',
            'respect', 'support', 'well-being', 'safety', 'decision',
            'awareness', 'emotional', 'relationship', 'communication'
        ];
    }
    
    /**
     * Moderate content for age-appropriateness
     */
    moderateContent(content) {
        if (!CONFIG.MODERATION.ENABLED) return true;
        
        const contentLower = content.toLowerCase();
        
        // Check for inappropriate keywords
        for (const keyword of this.inappropriateKeywords) {
            if (contentLower.includes(keyword)) {
                console.warn(`⚠️ Content moderation: Found inappropriate keyword "${keyword}"`);
                return false;
            }
        }
        
        // Require educational content
        const hasEducationalContent = this.educationalKeywords.some(
            keyword => contentLower.includes(keyword)
        );
        
        if (!hasEducationalContent) {
            console.warn('⚠️ Content moderation: Missing educational keywords');
            return false;
        }
        
        // Check content length
        if (content.length < 20) {
            console.warn('⚠️ Content moderation: Content too short');
            return false;
        }
        
        // Check for sensational language
        const sensationalWords = ['shocking', 'disturbing', 'horrific', 'graphic'];
        const sensationalCount = sensationalWords.filter(
            word => contentLower.includes(word)
        ).length;
        
        if (sensationalCount > 1) {
            console.warn('⚠️ Content moderation: Too much sensational language');
            return false;
        }
        
        return true;
    }
    
    /**
     * Validate question structure
     */
    validateQuestion(question) {
        const required = ['question', 'answers', 'correct', 'explanation'];
        
        // Check required fields
        if (!required.every(field => field in question)) {
            return false;
        }
        
        // Validate answers array
        if (!Array.isArray(question.answers) || question.answers.length !== 4) {
            return false;
        }
        
        // Validate correct index
        if (typeof question.correct !== 'number' || question.correct < 0 || question.correct > 3) {
            return false;
        }
        
        // Validate text fields
        if (!question.question || !question.explanation) {
            return false;
        }
        
        // Validate all answers are non-empty
        if (!question.answers.every(ans => ans && ans.trim())) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Extract JSON from response text
     */
    extractJSON(text) {
        // Remove markdown code blocks if present
        text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
        
        // Try to find JSON array
        const arrayMatch = text.match(/\[[\s\S]*\]/);
        if (arrayMatch) {
            try {
                return JSON.parse(arrayMatch[0]);
            } catch (e) {
                console.warn('Failed to parse JSON array:', e);
            }
        }
        
        // Try to parse entire text as JSON
        try {
            return JSON.parse(text);
        } catch (e) {
            console.warn('Failed to parse response as JSON:', e);
        }
        
        return null;
    }
    
    /**
     * Generate quiz questions using Gemini API
     */
    async generateQuestions(topic = null, count = 12) {
        if (!this.apiKey) {
            console.error('❌ Gemini API key not configured');
            return this.getFallbackQuestions(count);
        }
        
        const questionTopic = topic || CONFIG.QUIZ.DEFAULT_TOPIC;
        
        const prompt = `Generate exactly ${count} age-appropriate, educational multiple-choice quiz questions about ${questionTopic} for teenagers.

Follow the system guidelines strictly. Return ONLY a JSON array with no additional text or formatting.

Generate ${count} questions now:`;

        try {
            console.log(`🤖 Generating ${count} AI questions about: ${questionTopic}`);
            
            const response = await fetch(`${this.endpoint}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: this.systemPrompt + '\n\n' + prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 2048,
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Extract text from Gemini response
            const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (!responseText) {
                throw new Error('No response text from Gemini API');
            }
            
            console.log('✅ Received response from Gemini API');
            
            // Moderate entire response
            if (!this.moderateContent(responseText)) {
                console.error('❌ Generated content failed moderation');
                return this.getFallbackQuestions(count);
            }
            
            // Extract JSON
            const questions = this.extractJSON(responseText);
            
            if (!questions || !Array.isArray(questions)) {
                throw new Error('Failed to extract questions from response');
            }
            
            // Validate and moderate each question
            const validQuestions = [];
            
            for (let i = 0; i < questions.length; i++) {
                const q = questions[i];
                
                // Validate structure
                if (!this.validateQuestion(q)) {
                    console.warn(`⚠️ Question ${i} failed validation`);
                    continue;
                }
                
                // Moderate content
                if (!this.moderateContent(q.question) || 
                    !this.moderateContent(q.explanation) ||
                    !q.answers.every(ans => this.moderateContent(ans))) {
                    console.warn(`⚠️ Question ${i} failed moderation`);
                    continue;
                }
                
                // Add ID
                q.id = i;
                validQuestions.push(q);
            }
            
            console.log(`✅ Generated ${validQuestions.length}/${count} valid questions`);
            
            if (validQuestions.length < count / 2) {
                console.warn('⚠️ Too few valid questions, using fallback');
                return this.getFallbackQuestions(count);
            }
            
            // Return requested number of questions
            return validQuestions.slice(0, count);
            
        } catch (error) {
            console.error('❌ Error generating questions:', error);
            
            if (CONFIG.QUIZ.FALLBACK_TO_CURATED) {
                console.log('🔄 Falling back to curated questions');
                return this.getFallbackQuestions(count);
            }
            
            throw error;
        }
    }
    
    /**
     * Get fallback curated questions (Sex Education - English)
     */
    getFallbackQuestions(count = 12) {
        const curatedQuestions = [
            {
                id: 0,
                question: "What is the most effective method of contraception?",
                answers: [
                    "Using condoms or birth control pills correctly",
                    "Having sex on 'safe days' only",
                    "Drinking lots of water after sex",
                    "Washing after sex"
                ],
                correct: 0,
                explanation: "When used correctly, condoms and birth control pills are over 95% effective. The 'safe days' method is unreliable because menstrual cycles can vary."
            },
            {
                id: 1,
                question: "What does STI stand for?",
                answers: [
                    "Sexually Transmitted Infection",
                    "A type of vitamin",
                    "A contraceptive method",
                    "An antibiotic"
                ],
                correct: 0,
                explanation: "STIs are infections passed through sexual contact, including HIV, syphilis, gonorrhea, and HPV. They can be prevented by using condoms and regular health checkups."
            },
            {
                id: 2,
                question: "When does puberty typically begin?",
                answers: [
                    "Between ages 8-13 (varies by person)",
                    "After age 18",
                    "Only after marriage",
                    "After age 25"
                ],
                correct: 0,
                explanation: "Puberty usually starts between 8-13 for girls and 9-14 for boys. It's a natural process with physical and emotional changes. Everyone develops at their own pace."
            },
            {
                id: 3,
                question: "What does sexual consent mean?",
                answers: [
                    "Both people freely and clearly agree",
                    "Silence means yes",
                    "Only one person needs to agree",
                    "You can't change your mind once you agree"
                ],
                correct: 0,
                explanation: "Consent must be clear, voluntary, and can be withdrawn at any time. Silence is NOT consent. Both people have the right to say no at any time without explanation."
            },
            {
                id: 4,
                question: "What should you do if you feel pressured into sexual activity?",
                answers: [
                    "Say 'no' clearly and talk to a trusted adult",
                    "Stay silent and go along with it",
                    "Feel guilty",
                    "Keep it secret"
                ],
                correct: 0,
                explanation: "You always have the right to refuse any sexual activity. Say 'no' clearly, leave the situation, and tell a trusted adult. It's never your fault for saying no."
            },
            {
                id: 5,
                question: "What do condoms protect against?",
                answers: [
                    "Pregnancy and STIs",
                    "Only pregnancy",
                    "Only STIs",
                    "Nothing"
                ],
                correct: 0,
                explanation: "When used correctly, condoms prevent pregnancy AND reduce the risk of STIs including HIV. They provide dual protection."
            },
            {
                id: 6,
                question: "What is menstruation?",
                answers: [
                    "A natural monthly cycle in the female body",
                    "A disease",
                    "Something to be ashamed of",
                    "Only happens during pregnancy"
                ],
                correct: 0,
                explanation: "Menstruation is a natural, healthy process that typically occurs monthly from puberty to menopause. There's nothing shameful about it, and proper hygiene is important."
            },
            {
                id: 7,
                question: "What is a healthy relationship based on?",
                answers: [
                    "Respect, trust, and open communication",
                    "Control and jealousy",
                    "Keeping secrets from each other",
                    "Always agreeing with everything"
                ],
                correct: 0,
                explanation: "Healthy relationships require mutual respect, trust, honest communication, and support for each other's growth. Excessive jealousy and control are warning signs."
            },
            {
                id: 8,
                question: "How should you maintain good genital hygiene?",
                answers: [
                    "Wash daily with mild soap",
                    "Use strong perfumes",
                    "Don't need to wash",
                    "Use harsh chemicals"
                ],
                correct: 0,
                explanation: "Good hygiene includes daily washing with mild soap and wearing clean underwear. Avoid harsh chemicals that can cause irritation. The genital area has its own self-cleaning system."
            },
            {
                id: 9,
                question: "What is peer pressure about sex?",
                answers: [
                    "When friends pressure you to do things you're not ready for",
                    "When teachers assign homework",
                    "When parents set rules",
                    "A type of exercise"
                ],
                correct: 0,
                explanation: "Peer pressure is when others try to convince you to do something you're not ready for or don't want. You have the right to say 'no' to anything that makes you uncomfortable."
            },
            {
                id: 10,
                question: "What does body autonomy mean?",
                answers: [
                    "You have the right to make decisions about your own body",
                    "Others decide for you",
                    "You must let others touch you",
                    "Ignoring your health"
                ],
                correct: 0,
                explanation: "Body autonomy means you have control over what happens to your body. No one can touch you without permission. You always have the right to say no."
            },
            {
                id: 11,
                question: "How is HIV/AIDS transmitted?",
                answers: [
                    "Unprotected sex, sharing needles, mother to child",
                    "Handshakes, hugs, cheek kisses",
                    "Sharing dishes or glasses",
                    "Using the same toilet"
                ],
                correct: 0,
                explanation: "HIV is transmitted through blood, semen, vaginal fluids, and breast milk. It's NOT spread through casual contact like handshakes or sharing food. Condoms help prevent HIV transmission."
            },
            {
                id: 12,
                question: "What are the risks of teenage pregnancy?",
                answers: [
                    "High health risks for mother and baby, impacts education",
                    "No problems at all",
                    "Very safe",
                    "Good for health"
                ],
                correct: 0,
                explanation: "Teen pregnancy carries health risks (anemia, preeclampsia) and affects education and future opportunities. It's important to have contraceptive knowledge and medical support if needed."
            },
            {
                id: 13,
                question: "Where should you learn about sex education?",
                answers: [
                    "Parents, teachers, doctors, trusted medical resources",
                    "Adult films",
                    "Rumors from friends",
                    "Unverified social media"
                ],
                correct: 0,
                explanation: "Accurate sex education should come from trusted sources like parents, teachers, doctors, and medical books. Avoid rumors or misleading online content."
            },
            {
                id: 14,
                question: "What are wet dreams?",
                answers: [
                    "A natural occurrence in males during sleep",
                    "A disease",
                    "Something abnormal",
                    "A sign of health problems"
                ],
                correct: 0,
                explanation: "Wet dreams (nocturnal emissions) are normal for adolescent boys during puberty. There's no need to worry or feel embarrassed. It's the body's way of regulating hormones."
            },
            {
                id: 15,
                question: "When can a woman get pregnant?",
                answers: [
                    "During ovulation (usually mid-cycle)",
                    "At any time",
                    "Only during menstruation",
                    "Only at night"
                ],
                correct: 0,
                explanation: "Women are most fertile during ovulation (typically days 12-14 of a 28-day cycle). However, cycles vary, so contraception is needed if you're not ready for pregnancy."
            },
            {
                id: 16,
                question: "When should you talk to a doctor about reproductive health?",
                answers: [
                    "When you have questions, concerns, or unusual symptoms",
                    "Never necessary",
                    "Only after marriage",
                    "Only after serious problems"
                ],
                correct: 0,
                explanation: "Don't hesitate to talk to a doctor about reproductive health. Doctors are trained to help you professionally and confidentially. Early detection leads to better treatment."
            },
            {
                id: 17,
                question: "What are signs of an unhealthy relationship?",
                answers: [
                    "Control, violence, lack of respect",
                    "Minor disagreements",
                    "Needing personal space",
                    "Having different interests"
                ],
                correct: 0,
                explanation: "Warning signs include excessive control, violence (physical/verbal), extreme jealousy, isolating you from family/friends. If experiencing this, seek help immediately."
            },
            {
                id: 18,
                question: "Is masturbation harmful?",
                answers: [
                    "No, it's natural and normal",
                    "Very dangerous",
                    "Causes mental illness",
                    "Stunts growth"
                ],
                correct: 0,
                explanation: "Masturbation is natural, safe, and not harmful. It's a way to explore your own body. Claims about harmful effects are myths without scientific basis."
            },
            {
                id: 19,
                question: "What does the HPV vaccine do?",
                answers: [
                    "Prevents cervical cancer and HPV-related diseases",
                    "Cures the flu",
                    "Prevents pregnancy",
                    "Increases height"
                ],
                correct: 0,
                explanation: "The HPV vaccine prevents HPV virus - the main cause of cervical cancer, anal cancer, and genital warts. Most effective when given before becoming sexually active."
            },
            {
                id: 20,
                question: "What does safe sex include?",
                answers: [
                    "Using condoms, limiting partners, regular testing",
                    "No protection needed",
                    "Just trusting each other",
                    "Washing after sex is enough"
                ],
                correct: 0,
                explanation: "Safe sex includes: proper condom use, limiting partners, regular STI testing, open communication with partners. Trust is important but doesn't replace protection methods."
            },
            {
                id: 21,
                question: "What is family planning?",
                answers: [
                    "Planning when and how many children to have",
                    "Only for married people",
                    "Not allowed to have children",
                    "Required to have children"
                ],
                correct: 0,
                explanation: "Family planning is the right to decide the number, spacing, and timing of children based on your circumstances. It helps ensure mother and child health and family stability."
            },
            {
                id: 22,
                question: "Who can be a victim of sexual violence?",
                answers: [
                    "Anyone, regardless of gender, age, or clothing",
                    "Only women",
                    "Only people wearing revealing clothes",
                    "Only people out at night"
                ],
                correct: 0,
                explanation: "Sexual violence can happen to anyone. The fault ALWAYS lies with the perpetrator, NEVER the victim. Clothing and behavior are never excuses for violence."
            },
            {
                id: 23,
                question: "Do female condoms exist?",
                answers: [
                    "Yes, and they're as effective as male condoms",
                    "They don't exist",
                    "They're not effective",
                    "Only for older people"
                ],
                correct: 0,
                explanation: "Female condoms are effective contraception and STI prevention, allowing women to take control of protection. Can be inserted before sex and don't require male partner cooperation."
            }
        ];
        
        // Shuffle answers for each question to randomize correct answer position
        const questionsWithShuffledAnswers = curatedQuestions.map(q => {
            return this.shuffleAnswers(q);
        });
        
        // Randomize question order and return requested number
        const shuffled = questionsWithShuffledAnswers.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, shuffled.length));
    }
    
    /**
     * Shuffle answers and update correct index
     */
    shuffleAnswers(question) {
        const q = { ...question };
        const correctAnswer = q.answers[q.correct];
        
        // Create array of answer indices
        const indices = [0, 1, 2, 3];
        
        // Fisher-Yates shuffle
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        
        // Reorder answers according to shuffled indices
        q.answers = indices.map(i => question.answers[i]);
        
        // Find new position of correct answer
        q.correct = q.answers.indexOf(correctAnswer);
        
        return q;
    }
}

// Create singleton instance
const geminiQuizService = new GeminiQuizService();
