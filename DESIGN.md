# Design

Product design doc for Guess That Number. Covers what the game is, how the
page is built, and the stuff that looks like bugs but isn't.


## What it is

Two friends, a programmer and an artist, on an overnight public bus from
Delhi to Dharamsala, late 2008 or early 2009, bumpy and unpleasant, invent a
game out loud: say how many numbers there are, one holds one of them, the
other guesses, yes or no. They play for hours. Neither remembers how it ended. It was never about the number. It
was a way to spend the ride.

The site is that bus ride. The real road on a map, as many numbers as you
say, one of them the right one. Wrong guesses move the bus somewhere along
the road; the right one gets you to McLeod Ganj.


## The Game

- **How many, first** — the most important move in the game, so it gets
  the whole game side of the screen: a big "How many?" and a stepper,
  minus, the count, plus, a check mark. Starts at 12; 1 to 1024, one at a
  time. The route shows the count as cuts as you change it (see below).
  Back to Delhi asks again from 12
- **The board** — the smallest square that holds the count, filled in
  order; what doesn't fill stays empty. 24 is a 5×5 missing its last cell.
  The square is as big as fits right of the road, so boxes and numbers
  scale with the side. Never scrolls
- **The secret** — pressing the check picks one number at random. Nobody
  says which
- **Guessing** — click a number. Wrong: "No." and a line from the road, the
  box browns out and is done with, and the bus lands on a random cut short
  of the end. Right: the bus is in McLeod Ganj and it's "YOU WIN." Every
  board ends within as many guesses as it has numbers
- **The cuts** — n numbers cut the road into n equal stretches by distance,
  so n − 1 marks along the route. The bus only ever stands on a cut; the
  last one is McLeod Ganj. Past 512 the marks would paint over the road, so
  they aren't drawn
- **The road talks** — a wrong guess gets a beat from `beats`, picked by
  `beatAt` from where the bus landed; if it landed behind where it was, a
  line from `setbacks` instead. The clock follows the bus
- **Winning** — the bus reaches McLeod Ganj, your number turns orange,
  and one big milestone comes up over the board: मैक्लोडगंज · McLeod Ganj
  in its yellow top, "You win." below. Nothing flashes, nothing rains
  down: an arrival, not a jackpot. Click it to go back to Delhi
- **The road** — `route.js` holds the driving route from ISBT Kashmere Gate
  to McLeod Ganj, fetched once from OSRM (OpenStreetMap data) and baked in:
  about 6,000 `[lat, lng]` points, 501 km. Nothing is fetched at runtime
  except map tiles, fonts, and the libraries


## Visual Design

Plain and modern, with the place coming from the road itself rather than
from decoration. No colonial nostalgia (no survey sheets, parchment, Raj
railway styling) and no religious or cultural imagery used as ornament —
that includes marigolds and sindoor on the Hindu side and prayer flags on
the Tibetan one. McLeod Ganj is home to the Tibetan exile community; the
story names the place and the design leaves it at that. If a motif isn't
something you'd actually see from the bus, it doesn't go in.

- **Milestones** — the one motif. Indian National Highway kilometre stones
  are white with a yellow top; every number on the board is one: rounded
  top in highway yellow `#f2c200`, white below, ink outline. Asked ones grey
  out. The check mark is yellow too
- **Bilingual names** — the two ends of the road are labelled Hindi over
  English, the way the road signs do it: दिल्ली / Delhi, मैक्लोडगंज /
  McLeod Ganj. Only where the real signs would be
- **Type** — from Indian type foundries, covering Devanagari and Latin:
  Baloo 2 ExtraBold (Ek Type) for the title and the win, heavy but fancy;
  Mukta (Ek Type) for everything else. Google Fonts
- **The band** — full width across the top, off-white with a hairline:
  the title on the left, the road's line and the clock during the ride
- **Map** — full bleed under everything below the band, OpenStreetMap
  tiles via Leaflet 1.9, greyed and faded, fitted so the route runs down
  the left third. Not for touching. Route in red `#d0021b`, the only thing
  on the map that shouts. Bus is an orange dot; cuts are dark dots ringed
  in white, white specks past 64
- **The line** — a hairline at 35% splits the road from the game; the
  game's side is washed a touch darker. There from the first screen
- **Winning** — calm on purpose. An earlier version went full confetti and
  rocking colour-cycled text; it read like a lottery. Now it's the last
  milestone, and that's enough
- **Palette** — tokens on `:root` in `style.css`: paper `#fafaf7`, ink
  `#1d1d1b`, road red, bus orange `#ff8c1a`, milestone yellow


## Architecture

No build system, no bundler, no package manager. Static files in `www/`, plus
jQuery 2.0.2 and Leaflet 1.9.4 from CDNs.

### route.js (RouteData)

`{ km, coords }`. Data only. Regenerate by hand if the road ever changes; the
OSRM call is in the git history of this file's first commit.

### miryam.js (MiryamModule)

Pure, no DOM. Story (`howMany`, `departure`, `beats`, `setbacks`), pacing
(`beatAt`, `clockFor`, `minutes`), `towns`, and the road geometry helpers:
`lengthKm`, `pointAt(coords, fraction)`, `fractionOf(coords, latlng)`.
Flat-earth distances; fine at 500 km. `answers`, `arrival`, `slice` and
`setback` are left over from the coin-flip version and unused by the page.

### game.js (GameModule)

Left over from the tile version. Only `randomRange` is used now.

### guess.js

All DOM and Leaflet work: `drawMap()` for the map, `drawCuts(n)` for the
marks on the route, `drawPad(n)` for the board, `step()` for the stepper,
`ask()` for a guess, `celebrate()` for the last milestone, `deal()` for Delhi, and
`autoPlay()` for riding the bus without lifting a finger.

### Tests

`node www/test.js`. Covers the story pacing, the clock, the question cost,
and the road geometry against the baked route, including that the towns sit
on it in order. No browser tests.


## Edge Cases (by design)

- **A board of one** — one box, no cuts, and you win. Fine
- **Wrong guesses can go backwards** — the bus lands on any cut short of
  the end, behind or ahead. The road doesn't care how close you were
- **The map doesn't re-fit on resize** — reload
- **Reload loses the ride** — nothing is saved. That's the bus


## Known Limitations

- **Tiles come from openstreetmap.org** — fine for a small site; heavy use
  would want a proper tile provider
- **Dead analytics** — Universal Analytics (`UA-` tracking ID) shut down in
  2023
- **Phone width** — the layout splits the screen 35/65 and the band is one
  row; narrow screens haven't been looked at
- **Stepping to a big board is slow** — one click per number, so 1024 is
  a thousand clicks
