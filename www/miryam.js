var MiryamModule = (function() {
    // Delhi ISBT Kashmere Gate to McLeod Ganj, by road, more or less.
    var km = 480;

    var departure = "Delhi, evening. Find McLeod Ganj.";

    // The overnight bus, in order. Edit freely.
    var beats = [
	"ISBT Kashmere Gate. The bus is late. Of course it's late.",
	"Two seats near the back. The window doesn't quite close.",
	"The engine turns over on the third try. We're moving.",
	"Delhi takes an hour to let go of us.",
	"The conductor comes for tickets. Then for more money.",
	"Somewhere past the ring road the horn stops being a surprise.",
	"Miryam asks how long. Twelve hours, they said. They say that.",
	"The laptop comes out. Battery says 74%.",
	"Panipat. Trucks in both directions, painted like temples.",
	"What's the dumbest game we could possibly make?",
	"Pick a number. Guess the number. That's it. That's the game.",
	"Karnal goes by as a strip of dhaba lights.",
	"No hints, Miryam says. Hints would ruin it.",
	"The seat in front reclines all the way into my knees.",
	"Kurukshetra. A war was fought here. The bus doesn't slow down.",
	"First stop. Chai in glasses too hot to hold.",
	"Everyone back on. Someone new is in our seats.",
	"Ambala. The road splits. We take the one that goes up.",
	"The window rattles in a rhythm you could almost count to.",
	"There is no strategy, we agree. That's rule six.",
	"Chandigarh is a bypass in the dark, sodium orange, then gone.",
	"Miryam falls asleep against the glass for exactly nine minutes.",
	"Battery 41%. The game has a red state and a green state now.",
	"Ropar. The river is out there somewhere, black on black.",
	"A dhaba at 1am. Parathas. A dog that knows the schedule.",
	"Kiratpur. The road starts to turn, then it doesn't stop turning.",
	"The driver takes the hairpins like he's late for something.",
	"If you don't give up, you will eventually win. Rule seven.",
	"Every bump lands in a different vertebra.",
	"Una. Half asleep, half awake, all of it bouncing.",
	"The laptop closes. Battery 12%. The game works, mostly.",
	"Grey in the window. Not light yet, but the idea of light.",
	"The Kangra valley opens up and the mountains are just there.",
	"Snow on the Dhauladhar. Miryam is awake now.",
	"Kangra. Tea on the roadside, monkeys on the roof.",
	"Twelve hours ago somebody said twelve hours.",
	"Dharamsala. The bus empties. We stay on.",
	"The last climb. Nine kilometres of switchbacks and prayer flags.",
	"Pine trees, cold air, a monastery gate.",
	"The bus stops. Nobody says anything for a second."
    ];

    var arrival = "McLeod Ganj. We're here.";

    // Which beat to show after the nth tile has been clicked, out of total.
    // Paced so the last beat lands as the board fills up.
    var beatFor = function(clicked, total) {
	var fraction = (clicked - 1) / Math.max(total - 1, 1);
	return Math.min(beats.length - 1, Math.floor(fraction * beats.length));
    };

    return { km, departure, beats, arrival, beatFor };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = MiryamModule;
}
