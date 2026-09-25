# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Guess That Number" is a client-side web game with no build system and no
backend. It is the overnight bus from Delhi to McLeod Ganj on which the game
was invented: the real road, a diagram of it, a hundred numbers. Ask if it's
this one, the road says yes or no at random, the bus moves a random slice of
the ride either way; the ride ends only on arrival. Hosted at
`guessthatnumber.edgemon.org`. See DESIGN.md for the full design.

## Development

No build step or package manager. Serve `www/` with any static server (the
page loads Leaflet and jQuery from CDNs and map tiles from OpenStreetMap, so
opening the file directly also works). Tests: `node www/test.js`.

**Deployment** uses Nginx:
```bash
sudo cp etc/nginx/guessthatnumber.edgemon.org /etc/nginx/sites-available/guessthatnumber
sudo ln -s /etc/nginx/sites-available/guessthatnumber /etc/nginx/sites-enabled/
sudo /etc/init.d/nginx reload
```

## Architecture

Static files in `www/`:

- **index.html** — the page; loads Leaflet 1.9.4 and jQuery 2.0.2 from CDNs
- **style.css** — chrome, background map, road diagram, number pad, arrival
  overlay
- **route.js** — the baked driving route, `[lat, lng]` points, from OSRM
- **miryam.js** — pure: story beats, answers, clock, question cost, towns,
  road geometry helpers; tested in `test.js`
- **guess.js** — all Leaflet and DOM work: `drawMap`, `drawTrack`, `ask`,
  `deal`, `autoPlay` easter egg
- **game.js** — leftover; only `randomRange` is used
