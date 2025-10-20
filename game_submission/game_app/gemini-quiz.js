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
     * Get fallback curated questions
     */
    getFallbackQuestions(count = 12) {
        const curatedQuestions = [
            {
                id: 0,
                question: "What is the best way to prevent pregnancy?",
                answers: [
                    "Abstinence or contraception",
                    "Crossing fingers",
                    "Drinking coffee",
                    "Eating vegetables"
                ],
                correct: 0,
                explanation: "Abstinence (not having sex) is 100% effective. If sexually active, contraception like condoms or birth control pills are highly effective when used correctly."
            },
            {
                id: 1,
                question: "What does STI stand for?",
                answers: [
                    "Sexually Transmitted Infection",
                    "Super Tight Infection",
                    "Simple Test Info",
                    "Safe Time Indicator"
                ],
                correct: 0,
                explanation: "STI stands for Sexually Transmitted Infection - infections passed through sexual contact that can be prevented with protection and regular testing."
            },
            {
                id: 2,
                question: "What is consent in a relationship?",
                answers: [
                    "Clear, voluntary agreement by all parties",
                    "Silence means yes",
                    "Maybe means yes",
                    "Only needed once"
                ],
                correct: 0,
                explanation: "Consent is a clear, enthusiastic 'yes' that can be withdrawn at any time. It must be given freely without pressure, and silence or maybe never means yes."
            },
            {
                id: 3,
                question: "At what age is it appropriate to learn about puberty?",
                answers: [
                    "Before it starts (8-10 years)",
                    "After 18",
                    "Never",
                    "Only in college"
                ],
                correct: 0,
                explanation: "Learning about puberty before it happens (typically ages 8-10) helps young people understand and cope with the physical and emotional changes in their bodies."
            },
            {
                id: 4,
                question: "What is the most effective way to prevent STIs?",
                answers: [
                    "Using condoms correctly and consistently",
                    "Wishful thinking",
                    "Taking vitamins",
                    "Drinking lots of water"
                ],
                correct: 0,
                explanation: "Condoms, when used correctly every time, significantly reduce the risk of most STIs. Abstinence is the only 100% effective method."
            },
            {
                id: 5,
                question: "Should both partners discuss contraception?",
                answers: [
                    "Yes, it's a shared responsibility",
                    "No, only one person's choice",
                    "Only if married",
                    "Only after pregnancy"
                ],
                correct: 0,
                explanation: "Both partners should discuss and agree on contraception methods as it affects both people equally and promotes healthy communication."
            },
            {
                id: 6,
                question: "What should you do if someone pressures you into sexual activity?",
                answers: [
                    "Say no firmly and remove yourself from the situation",
                    "Give in to avoid conflict",
                    "Stay silent",
                    "Feel guilty about saying no"
                ],
                correct: 0,
                explanation: "You always have the right to say no. Leave the situation immediately and talk to a trusted adult. Never feel guilty for protecting yourself."
            },
            {
                id: 7,
                question: "What is a healthy relationship based on?",
                answers: [
                    "Respect, trust, and open communication",
                    "Control and jealousy",
                    "Always agreeing with each other",
                    "Keeping secrets from each other"
                ],
                correct: 0,
                explanation: "Healthy relationships require mutual respect, trust, honest communication, and supporting each other's independence and personal growth."
            },
            {
                id: 8,
                question: "What is a sign of good mental wellbeing?",
                answers: [
                    "Being able to cope with normal life stress",
                    "Never feeling sad or stressed",
                    "Avoiding all difficult situations",
                    "Not needing friends or family"
                ],
                correct: 0,
                explanation: "Good mental health means you can handle life's challenges effectively, not that you never face difficulties. Everyone experiences stress and sadness sometimes."
            },
            {
                id: 9,
                question: "Who should you talk to if you're struggling with mental health?",
                answers: [
                    "Trusted adult, counselor, or mental health professional",
                    "Nobody - handle it alone",
                    "Only strangers online",
                    "Keep it secret always"
                ],
                correct: 0,
                explanation: "Talking to trusted people and professionals is important. Mental health struggles are common and treatable - you don't have to face them alone."
            },
            {
                id: 10,
                question: "What is peer pressure?",
                answers: [
                    "When friends influence you to do something you're unsure about",
                    "When teachers give homework",
                    "When parents set rules",
                    "A type of exercise"
                ],
                correct: 0,
                explanation: "Peer pressure is when friends or classmates try to influence your decisions. It's okay to say no to things you're uncomfortable with, even if others are doing it."
            },
            {
                id: 11,
                question: "What is body autonomy?",
                answers: [
                    "Your right to make decisions about your own body",
                    "Following what others say about your body",
                    "Letting others touch you without permission",
                    "Not caring about your health"
                ],
                correct: 0,
                explanation: "Body autonomy means you have the right to decide what happens to your body. No one should touch you without your permission, and you can always say no."
            }
        ];
        
        return curatedQuestions.slice(0, Math.min(count, curatedQuestions.length));
    }
}

// Create singleton instance
const geminiQuizService = new GeminiQuizService();
