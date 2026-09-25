# Design

Product design doc for Guess That Number. Covers the visual system, architecture, game mechanics, and the stuff that looks like bugs but isn't.


## Visual Design

### Palette

Three-tier surfaces:
- **Body** — `#f2f2f8` (cool off-white)
- **Panels** — `#fff` (message bar, menu, play-again)
- **Tiles** — `#e8e8f0` (light grey with a hint of lavender)

Accent violet `#6c5ce7` used for focus rings, play-again border, and hover fills.

Tile states:
- **Wrong** — pink `#f0c4ca` background, dark rose `#8a2d3b` text
- **Right** — mint `#c4f0e0` background, deep teal `#1a5c48` text

Text colors: `#1a1a2e` primary, `#6a6a80` muted (menu labels). Borders throughout are `#d8d8e4`.

### Typography

Monospace everywhere. The title is uppercase with `0.15em` letter-spacing, normal weight. Size hierarchy: 2em for the message bar and tiles, 3em for play-again, 1.2em for the input field.

### Layout

- **Background** — the road from Delhi to Dharamsala, where the game was invented, on OpenStreetMap tiles via Leaflet 1.9: full screen behind everything, tiles greyed and faded, the route in red `#d0021b`, fitted into the left third. Not for touching. `route.js` holds the route, baked from OSRM
- **The game's side** — everything else lives in the right two-thirds, beside the road rather than on it
- **Message bar** — loud on purpose: full width across the top, 64px, violet `#6c5ce7` with big bold white text, z-index 100. Every new line bounces in
- **Menu panel** — centred on the game's side (400px, never wider than the screen), 20% from the top, a little see-through
- **Button area** — the numbers live in a soft rounded panel (`#buttons`) that hugs them, centred on the game's side with 8px gaps; a board too big to fit starts at the top and scrolls there, not the page. Tiles are rounded white cards, slightly see-through, lifting with a violet edge on hover
- **Play-again** — takes over the button area: placed and sized from `guess.js` to cover exactly where the buttons are, or the visible part of the board when it scrolls. Text scales to fit, z-index 200
- **Phones** — under 700px wide everything goes full width, tiles shrink to 56px, and the road goes back to full screen behind it all

### Interactions

- Tile hover lifts 2px with a violet border and soft shadow; wrong/right tiles don't move
- Buttons and play-again hover fills violet `#6c5ce7` with white text
- Input focus shows violet border (no outline)
- The "_ numbers" button fills in as you type: "12 numbers", "abc numbers", whatever is in the box. Empty, it's "_ numbers" again
- Transitions: 0.15s on tiles, 0.2s on buttons and play-again


## Architecture

No build system, no bundler, no package manager. Static files in `www/`, plus jQuery 2.0.2 from Google's CDN and Leaflet 1.9.4 from cdnjs.

### game.js (GameModule)

IIFE that exports `randomRange`, `makeResponse`, `Game` class, and the response arrays (`missingResponses`, `hittingResponses`). Pure logic, no DOM access.

`Game` takes a number, picks a secret via `randomRange`, and tracks guesses in a Set. Has `makeGuess(n)` and `isComplete()` methods, though neither is currently called by the UI (see Known Limitations).

Conditionally exports via `module.exports` so it can be tested with Node.

### guess.js

IIFE that consumes GameModule. All DOM work lives here:

- `createGame(number)` — builds the clickable tile grid, wires click handlers
- `sendMessage(message)` — updates the `#message` bar
- `showBoard()` / `unhideMenu()` — toggles between menu and game views
- `showPlayAgain()` — lays play-again over the button area
- `choiceClick()` / `randomClick()` — entry points from the two menu buttons
- `autoPlay()` — easter egg; auto-clicks random remaining tiles every 50ms
- `drawMap()` — the background map and route, once, on load

Click handlers manage state via jQuery class toggling (`.wrong` / `.right`) and check the guess against `game.secret` directly.

### Separation

game.js is testable (there's a test.js). guess.js is the UI controller with side effects. The boundary is clean but the UI doesn't use the Game class's own methods for guessing — it reads `.secret` and does its own bookkeeping via DOM state.


## Game Flow

1. **Menu** — player types a number or clicks "random" (picks 10–1000)
2. **Play** — tiles appear, click to guess. Wrong adds `.wrong` class + random miss message. Right adds `.right` class + win message + shows play-again overlay
3. **Auto-win** — when one tile remains unclicked, it's automatically marked correct
4. **Play again** — click the overlay, resets to menu


## Edge Cases (by design)

These are features, not bugs. They were made intentional in commit `c36f4b2`.

- **0** — empty board, instant win message, play-again shown immediately. You win by doing nothing.
- **Negative numbers** — generates tiles from N to -1. Works fine, just weird.
- **Non-numeric input** — "Please pick a number" message, stays on menu. This is the only validation.


## Design Philosophy

The game is intentionally simple. No hints, no strategy, no score, no timer. You click tiles until you find the number. If you don't give up, you will eventually win.

It was created on a rickety bus from Delhi to Dharamsala to kill time. The "dumbness" is the point — the README's only known issue is "not yet dumb enough."

Edge cases producing weird behavior (winning instantly with 0, guessing negative numbers) fit the spirit of the thing. Making them work mechanically was more fun than rejecting them.


## Known Limitations

- **Map doesn't re-fit on resize** — reload
- **Tiles come from openstreetmap.org** — fine for a small site; heavy use would want a proper tile provider
- **Dead analytics** — Universal Analytics (`UA-` tracking ID) shut down in 2023
- **XHTML 1.0 Strict doctype** — legacy artifact, plain `<!DOCTYPE html>` would do
- **Unused Game methods** — `Game.makeGuess()` and `Game.isComplete()` are defined but never called; the click handler reads `game.secret` directly and tracks state via DOM classes
