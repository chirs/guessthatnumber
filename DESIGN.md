# Design

Product design doc for Guess That Number. Covers what the game is, how the
page is built, and the stuff that looks like bugs but isn't.


## What it is

Two friends, a programmer and an artist, on an overnight public bus from
Delhi to Dharamsala, late 2008 or early 2009, bumpy and unpleasant, invent a
game out loud: say how many numbers there are, one holds one of them, the
other guesses, yes or no. They play for hours. Neither remembers how it ended. It was never about the number. It
was a way to spend the ride.

The site is that bus ride. The real road, a diagram of it, as many numbers as you say.
Every question moves the bus a little and the bus moves whether the answer
was yes or no. The only ending is arrival.


## The Game

- **How many first** — the page opens asking how many numbers there are,
  with a field in the message bar and nothing on the pad. Type a number,
  press enter, and the pad is 1 to that number for the rest of the ride.
  No cap; a big board scrolls. Then "Pick a number." and the ride starts.
  A board of three means tapping the same three all night
- **Yes or no** — click a number. The road says "Yes." or "No." by coin
  flip. There is no secret number. Yes ends nothing. The number browns out
  but stays live; asked again it gets a fresh coin
- **Every question costs road** — `slice` in `miryam.js`: between 5 and 30
  minutes of the 600, at random, 5% of the ride at most. About 1 in 6
  questions (`setback`) spends that slice going backwards instead, never
  past Delhi, with a line from `setbacks` in place of the beat. A ride is
  about fifty questions but nobody knows. Clock follows the minutes, bus
  follows the clock, kilometres to go follow the bus
- **The road talks** — after the answer comes a beat from `beats`, picked by
  `beatAt` from how far along the ride is, so the last one lands as the bus
  climbs into the hills. Fast rides skip beats. That's fine
- **Arrival** — when the minutes run out: "McLeod Ganj. We're here." and a
  `back to delhi` overlay that puts the bus back at the stand and asks how
  many again
- **No opener** — the page loads ready: bus on Delhi, 8:00 pm, `howMany`
  in the message bar. The first click is getting on the bus. The name lives
  in the tab title
- **The road** — `route.js` holds the driving route from ISBT Kashmere Gate
  to McLeod Ganj, fetched once from OSRM (OpenStreetMap data) and baked in:
  about 6,000 `[lat, lng]` points, 501 km. Nothing is fetched at runtime
  except map tiles


## Visual Design

Modern map, not an old one. The bus was 2007.

- **Background** — the real road on OpenStreetMap standard tiles via Leaflet
  1.9 (cdnjs), full bleed, fitted to the whole route, tiles greyed and faded
  so the chrome reads over it. A saffron dot on the road is the bus, moved
  along the route with every question. No key, attribution
  bottom right
- **Diagram** — a white panel down the left: one navy line, Delhi at the
  bottom, McLeod Ganj at the top, the towns as white knots at their true
  share of the road. Chandigarh is about halfway and the hill towns crowd
  the top; the labels are nudged apart, the knots are not. Saffron bus dot
  with a white ring eases up the line on every question, kilometres to go
  beside it
- **Pad** — the numbers in navy-ringed white squares, always live,
  ten across against the right edge. Saffron while pressed, browned out
  once asked. Still live: nothing is hidden, and asking again gets a fresh
  coin. Back to Delhi clears them
- **Chrome** — system sans-serif. Message bar full width on top, clock top
  right, arrival overlay centered. Panels white with a hairline border
- **Palette** — navy `#1f3a93` road, saffron `#ff9933` bus, India green
  `#138808` kept in reserve. The saffron, white, and green are the only
  India in the palette. Keep it at that


## Architecture

No build system, no bundler, no package manager. Static files in `www/`, plus
jQuery 2.0.2 and Leaflet 1.9.4 from CDNs.

### route.js (RouteData)

`{ km, coords }`. Data only. Regenerate by hand if the road ever changes; the
OSRM call is in the git history of this file's first commit.

### miryam.js (MiryamModule)

Pure, no DOM. Story (`departure`, `beats`, `arrival`, `answers`), pacing
(`beatAt`, `clockFor`), the constants (`minutes`, `slice`), `towns` for the
diagram, and the road geometry helpers: `lengthKm`, `pointAt(coords,
fraction)`, `fractionOf(coords, latlng)`. Flat-earth distances; fine at
500 km.

### game.js (GameModule)

Left over from the tile version. Only `randomRange` is used now.

### guess.js

All DOM and Leaflet work: `drawMap()` for the background, `drawTrack()` for
the diagram, `ask()` for a question, `deal()` for Delhi, and `autoPlay()`
for riding the bus without lifting a finger.

### Tests

`node www/test.js`. Covers the story pacing, the clock, the question cost,
and the road geometry against the baked route, including that the towns sit
on it in order. No browser tests.


## Edge Cases (by design)

- **Rides always end** — you can't lose, and you can't win. If you keep
  asking, you will eventually arrive
- **Yes means nothing** — a yes is worth exactly one no. Anyone who stops on
  a yes has misunderstood the bus
- **Ride length varies** — twenty questions or forty. The dice are the road
- **Reload loses the ride** — nothing is saved. That's the bus


## Known Limitations

- **Tiles come from openstreetmap.org** — fine for a small site; heavy use
  would want a proper tile provider
- **Dead analytics** — Universal Analytics (`UA-` tracking ID) shut down in
  2023
- **Phone width** — the diagram is fixed to the left and the pad sits beside
  it; narrow screens haven't been looked at
