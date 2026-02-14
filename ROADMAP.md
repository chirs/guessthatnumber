## Roadmap

Things that could be improved, roughly in order of how much they bother me.

### Bugs


### Should Fix

* **Google Analytics is dead** — uses Universal Analytics (`UA-` tracking ID), which Google shut down in 2023

### Could Improve

* **No mobile support** — fixed-width layout with large padding; unplayable on phones
* **No viewport meta tag** — browsers don't know to scale for mobile
* **Unused `Game` methods** — `makeGuess()` and `isComplete()` are defined on the Game class but never called; the click handler checks `game.secret` directly
* **XHTML 1.0 Strict doctype** — an artifact of a different era; plain `<!DOCTYPE html>` would do

### Someday Maybe

* Track stats (guesses per game, win streak)
* Add a hint mode for the faint of heart
* Make it even dumber somehow (see README: "not yet dumb enough")
