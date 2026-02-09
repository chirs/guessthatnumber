# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Guess That Number" is a client-side web game with no build system, no backend, and no tests. Players pick a range, the game generates a secret number, and the player clicks numbers to find it. Hosted at `guessthatnumber.edgemon.org`.

## Development

No build step or package manager. Open `www/index.html` in a browser to run locally.

**Deployment** uses Nginx:
```bash
sudo cp etc/nginx/guessthatnumber.edgemon.org /etc/nginx/sites-available/guessthatnumber
sudo ln -s /etc/nginx/sites-available/guessthatnumber /etc/nginx/sites-enabled/
sudo /etc/init.d/nginx reload
```

Note: The Nginx config still references `src/` as the root directory but files now live in `www/`.

## Architecture

Three static files in `www/`:

- **index.html** — XHTML 1.0 Strict page; loads jQuery 2.0.2 from CDN and includes Google Analytics
- **style.css** — Layout and visual states (`.wrong` = red/incorrect, `.right` = green/correct)
- **guess.js** — All game logic in an IIFE; key functions: `createGame(number)` builds the clickable grid, `randomRange(start, end)` picks the secret number, `autoPlay()` is an easter egg that auto-clicks

## Known Issues

- Reward text doesn't update if the last number is guessed (noted in README TODO)
