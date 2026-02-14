## Roadmap

Things that could be improved, roughly in order of how much they bother me.

### Bugs

* **`autoPlay()` easter egg is broken** — picks a random index up to 999 regardless of how many guesses are on the board, so it usually tries to click an element that doesn't exist
* **Debug `console.log` calls left in** — `guess.js` logs the game object and every keypress to the console

### Should Fix

* **jQuery loaded over HTTP** — `index.html` loads jQuery 2.0.2 from `http://`, which modern browsers will block on HTTPS pages
* **Google Analytics is dead** — uses Universal Analytics (`UA-` tracking ID), which Google shut down in 2023
* **No input validation** — entering 0, negative numbers, or 100000 all "work" with varying degrees of chaos
* **Nginx config points to `src/` instead of `www/`** — noted in CLAUDE.md, hasn't been updated since the directory rename

### Could Improve

* **No mobile support** — fixed-width layout with large padding; unplayable on phones
* **No viewport meta tag** — browsers don't know to scale for mobile
* **Unused `Game` methods** — `makeGuess()` and `isComplete()` are defined on the Game class but never called; the click handler checks `game.secret` directly
* **XHTML 1.0 Strict doctype** — an artifact of a different era; plain `<!DOCTYPE html>` would do

### Someday Maybe

* Track stats (guesses per game, win streak)
* Add a hint mode for the faint of heart
* Make it even dumber somehow (see README: "not yet dumb enough")
