# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Guess That Number" is a client-side web game with no build system and no
backend. It is the overnight bus from Delhi to McLeod Ganj on which the game
was invented: the real road on a map, a square board of as many numbers as
you say, one of them secret. Wrong guesses drop the bus on a random cut
along the road; the right one gets you to McLeod Ganj. Hosted at
`guessthatnumber.edgemon.org`. See DESIGN.md for the full design.

## Development

No build step or package manager. Serve `www/` with any static server (the
page loads Leaflet and jQuery from CDNs, fonts from Google
and map tiles from OpenStreetMap, so opening the file directly also works). Tests: `node www/test.js`.

**Deployment** uses Nginx:
```bash
sudo cp etc/nginx/guessthatnumber.edgemon.org /etc/nginx/sites-available/guessthatnumber
sudo ln -s /etc/nginx/sites-available/guessthatnumber /etc/nginx/sites-enabled/
sudo /etc/init.d/nginx reload
```

## Architecture

Static files in `www/`:

- **index.html** — the page; loads Leaflet 1.9.4 and jQuery 2.0.2 from CDNs
- **style.css** — palette tokens, top band, map, milestone board, win card
- **route.js** — the baked driving route, `[lat, lng]` points, from OSRM
- **miryam.js** — pure: story beats, clock, towns, road geometry helpers;
  tested in `test.js`
- **guess.js** — all Leaflet and DOM work: `drawMap`, `drawCuts`,
  `drawPad`, `ask`, `celebrate`, `deal`, `autoPlay` easter egg
- **game.js** — leftover; only `randomRange` is used
