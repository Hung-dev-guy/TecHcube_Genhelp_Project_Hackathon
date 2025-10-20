# Game Assets - Maze of Choices

This directory contains all visual and audio assets for the Maze of Choices educational game.

## Directory Structure

```
assets/
├── images/          # Visual assets (SVG format)
│   ├── player1.svg  # Player 1 avatar (student with backpack)
│   ├── player2.svg  # Player 2 avatar (student with headphones)
│   ├── quiz.svg     # Quiz tile icon (question mark in speech bubble)
│   ├── goal.svg     # Goal tile icon (trophy with heart)
│   ├── tile_floor.svg  # Floor tile pattern
│   └── tile_wall.svg   # Wall tile pattern (brick)
└── sounds/          # Audio assets
    └── README.md    # Audio implementation documentation
```

## Image Assets

All images are created as **SVG (Scalable Vector Graphics)** files for:
- Perfect scaling at any resolution
- Small file sizes
- Easy editing and customization
- Cross-browser compatibility

### Character Assets

#### player1.svg (128x128)
- **Description**: Friendly student character with backpack
- **Style**: Cartoon, colorful
- **Colors**: Green backpack, blue shirt, brown hair
- **Alt text**: "Player 1 - Student with backpack"

#### player2.svg (128x128)
- **Description**: Friendly student character with headphones
- **Style**: Cartoon, colorful, with musical notes
- **Colors**: Pink/magenta clothing, blue headphones, purple hair
- **Alt text**: "Player 2 - Student with headphones"

### Game Tile Assets

#### quiz.svg (128x128)
- **Description**: Large question mark inside a yellow/gold speech bubble
- **Style**: Bright, attention-grabbing with sparkles
- **Colors**: Gold gradient with orange accents
- **Alt text**: "Quiz question tile"

#### goal.svg (128x128)
- **Description**: Gold trophy with pink heart and sparkles
- **Style**: Celebratory, rewarding
- **Colors**: Gold trophy, pink/red heart, yellow sparkles
- **Alt text**: "Goal - Finish line"

### Maze Tile Assets

#### tile_floor.svg (64x64)
- **Description**: Light green patterned floor tile
- **Style**: Friendly, clean, subtle pattern
- **Colors**: Light green (#E8F5E9) with decorative dots
- **Usage**: Walkable path tiles

#### tile_wall.svg (64x64)
- **Description**: Gray brick wall pattern
- **Style**: Solid, clear obstacle indicator
- **Colors**: Gray gradients (#555-#444) with brick pattern
- **Usage**: Non-walkable wall tiles

## Sound Assets

All sounds are generated dynamically using the **Web Audio API**. See `sounds/README.md` for details.

### Sound Effects:
1. **correct_answer** - Positive ascending chime (C5→E5→G5)
2. **wrong_answer** - Negative descending buzz
3. **move** - Short beep for player movement
4. **goal** - Celebratory arpeggio (C5→E5→G5→C6→E6)

## Implementation Notes

### CSS Integration

Assets are referenced in `style.css` using relative paths:

```css
.player1 {
    background-image: url('assets/images/player1.svg');
}

.tile.quiz {
    background-image: url('assets/images/quiz.svg');
}
```

### JavaScript Integration

The game renders tiles and players dynamically, with CSS classes applying the appropriate background images.

## Future Enhancements

### For Production:

1. **Images**: 
   - Consider creating PNG versions for older browsers
   - Add sprite sheets for animations
   - Create higher detail versions for larger screens

2. **Sounds**:
   - Replace Web Audio API sounds with professional audio files
   - Add background music
   - Include voice-over for questions (accessibility)

3. **Additional Assets**:
   - Particle effects for correct answers
   - Animated transitions
   - Loading screen graphics
   - Achievement badges

## Asset Credits

All assets created as placeholder graphics for the Maze of Choices educational game.

- **Created**: October 2025
- **Format**: SVG (images), Web Audio API (sounds)
- **License**: Part of RMIT Hackathon submission
- **Style**: Cartoonish, colorful, student-friendly

## Customization

To customize assets:

1. **SVG Images**: Edit `.svg` files in any text editor or vector graphics software (Inkscape, Adobe Illustrator)
2. **Colors**: Modify hex color values in SVG markup
3. **Sounds**: Adjust frequencies and note sequences in `script.js`

## Browser Compatibility

- **SVG Support**: All modern browsers (IE9+, Chrome, Firefox, Safari, Edge)
- **Web Audio API**: All modern browsers (IE11+, Chrome, Firefox, Safari, Edge)

## File Sizes

All SVG assets are extremely lightweight:
- Player avatars: ~2-3 KB each
- Game tiles: ~1-2 KB each
- Total image assets: <15 KB

No external sound files required (Web Audio API generates sounds in real-time).

---

**Note**: These are placeholder assets designed for rapid prototyping. For production use, consider commissioning professional artwork and sound design that aligns with your educational brand and target audience.
