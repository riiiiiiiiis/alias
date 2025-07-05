# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Алиас v2.0** - a Russian web-based implementation of the popular word-guessing team game "Alias". It's a single-page application where teams of 2 players each take turns explaining words to their teammates within a time limit.

## Development Commands

Since this is a pure frontend project with no build system:

- **Run locally**: Open `index.html` in any modern web browser
- **Testing**: Manual testing in browser (no automated test framework)
- **Deploy**: Serve static files from any web server

## Architecture Overview

### File Structure
```
/
├── index.html    # Main HTML with all screen markup
├── styles.css    # All CSS styles and responsive design
└── script.js     # Game logic, state management, and UI interactions
```

### Screen-Based Navigation
The application uses a single-page architecture with screen switching:
- **menuScreen**: Main menu with navigation
- **rulesScreen**: Game rules explanation
- **aboutScreen**: About page with game info
- **setupScreen**: Team configuration and game settings
- **gameScreen**: Active gameplay with timer and word cards
- **resultsScreen**: Final scores and winner announcement

All screens exist in the DOM simultaneously with `display: none/block` toggling via `showScreen(screenName)`.

### Core Game State
The entire game state is managed in a single `gameState` object in `script.js`:

```javascript
gameState = {
  teams: [{name, players, score}],    // Two teams with names and scores
  currentTeam: number,                // Active team index (0 or 1)
  currentPlayer: number,              // Active player index within team
  roundTime: number,                  // Configurable round duration
  targetScore: number,                // Points needed to win
  timer: setInterval,                 // Active timer reference
  timeLeft: number,                   // Remaining seconds
  roundActive: boolean,               // Is a round currently in progress
  usedWords: [],                      // Words already shown this game
  currentWord: string,                // Currently displayed word
  roundStats: {correct, skipped},     // Round statistics
  round: number,                      // Current round number
  lastWordMode: boolean               // Special "last word" game mode
}
```

### Word Management System
Two dictionaries are hardcoded in `script.js`:
- **standard**: ~80 simple words for families/casual play
- **advanced**: ~80 complex/abstract terms for experienced players

Words are randomly selected from the chosen dictionary, with used words tracked to avoid repetition.

### Special "Last Word" Mode
When 10 seconds remain in a round:
- Timer stops automatically
- New word appears
- Either team can answer
- First correct answer gets the point
- Round ends immediately after answer

### Sound System
Uses Tone.js for audio feedback:
- Different oscillator types for different events (correct/skip/warning/victory)
- Graceful degradation if audio fails
- 0.2 second duration for all sound effects

### Team Name Generation
Includes predefined sets of creative team names with emoji that can be randomly generated, with logic to ensure teams get different names.

## Key Implementation Details

### Timer Management
- Uses `setInterval` with 1-second intervals
- Automatically switches to "last word" mode at 10 seconds
- Visual warnings (color changes) in final seconds
- Sound alerts in last 5 seconds

### Screen Transitions
All navigation uses the central `showScreen()` function which hides all screens and shows the target. Each screen has its own show function (showMenu, showSetup, etc.).

### Responsive Design
Mobile-first approach with breakpoint at 768px:
- Grid layouts switch to single column
- Font sizes reduce appropriately
- Button layouts become vertical

### Data Persistence
Player names are saved in session memory (`savedNames` object) and restored between games within the same browser session.

## Code Style Notes

- All text content is in Russian
- Uses semantic HTML5 elements (nav, main, section, article)
- CSS uses gradients and animations extensively
- No external dependencies except Tone.js CDN
- Vanilla JavaScript with no frameworks
- Inline event handlers in HTML (onclick attributes)# Test commit
