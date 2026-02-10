var GameModule = (function() {
    var randomRange = function(start, end) {
	return Math.floor(start + (1 + end - start) * Math.random());
    };
    
    var missingResponses = [
	"Not it!",
	"Whoopsies!",
	"Keep trying!",
	"You're getting warmer (maybe)",
	"Try again!",
	"Sadly, no.",
	"Why can't you find it?",
	"Guess again?",
	"Don't give up!",
	"It's here somewhere.",
	"It's got to be here somewhere.",
	"Can you find it?",
	"Wrong again."
    ];
    
    var hittingResponses = [
	"You found it!",
	"Great job!",
	"There it is!",
	"What luck!",
	"You did it!",
    ];
    
    var makeResponse = function(lst) {
	return lst[randomRange(0, lst.length - 1)];
    };

    class Game {
        
	
	constructor(number) {
	    this.number = number;
	    this.secret = Math.floor(Math.random() * number) + 1;
	    this.guesses = new Set();
	}
	
	makeGuess(n) {
	    this.guesses.add(n);
	    return n === this.secret;
	}
	
	isComplete() {
	    return this.guesses.has(this.secret);
	}
    }
    
    
    return { randomRange, makeResponse, Game, missingResponses, hittingResponses };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameModule;
}
