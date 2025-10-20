# Sound Assets

This directory contains placeholder sound effects for the Maze of Choices game.

## Sound Files

The game uses Web Audio API to generate sound effects dynamically. No external audio files are required.

### Sound Effects:
1. **correct_answer** - Positive ascending chime (C5, E5, G5 notes)
2. **wrong_answer** - Negative descending buzz
3. **move** - Short beep for player movement
4. **goal** - Celebratory sound when reaching the goal

## Implementation

All sounds are generated using the Web Audio API in `script.js`. This approach:
- Works in all modern browsers
- Requires no external file downloads
- Provides consistent audio quality
- Is lightweight and fast

## Future Improvements

For production, consider replacing Web Audio API sounds with:
- High-quality WAV or OGG audio files
- Royalty-free sound effects from sources like:
  - Freesound.org
  - OpenGameArt.org
  - Zapsplat.com (with attribution)
