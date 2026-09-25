var MiryamModule = (function() {
    // Ten hours, they said. The bus leaves at eight.
    var minutes = 600;
    var departsAt = 20 * 60;

    // How much of the ride one question uses up, in minutes. Nobody knows.
    var slice = { min: 5, max: 30 };

    // The road answers. It isn't listening.
    var answers = ["Yes.", "No."];

    var departure = "Delhi, evening. Ten hours to McLeod Ganj. Pick a number.";

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

    // The towns the bus goes through, for the labels on the map.
    var towns = [
	{ name: "Delhi", lat: 28.6677, lng: 77.2273 },
	{ name: "Panipat", lat: 29.39, lng: 76.97 },
	{ name: "Karnal", lat: 29.69, lng: 76.99 },
	{ name: "Ambala", lat: 30.38, lng: 76.78 },
	{ name: "Chandigarh", lat: 30.73, lng: 76.78 },
	{ name: "Ropar", lat: 30.97, lng: 76.53 },
	{ name: "Kiratpur", lat: 31.18, lng: 76.57 },
	{ name: "Una", lat: 31.47, lng: 76.27 },
	{ name: "Kangra", lat: 32.10, lng: 76.27 },
	{ name: "Dharamsala", lat: 32.22, lng: 76.32 },
	{ name: "McLeod Ganj", lat: 32.2432, lng: 76.3213 }
    ];

    // Which beat to show some fraction (0..1) of the way to McLeod Ganj.
    var beatAt = function(fraction) {
	return Math.max(0, Math.min(beats.length - 1, Math.floor(fraction * beats.length)));
    };

    // What the clock says n minutes out of Delhi.
    var clockFor = function(elapsed) {
	var m = (departsAt + elapsed) % (24 * 60);
	var h = Math.floor(m / 60), mm = m % 60;
	var h12 = h % 12 === 0 ? 12 : h % 12;
	return h12 + ":" + (mm < 10 ? "0" : "") + mm + (h < 12 ? " am" : " pm");
    };

    // Distance along a [lat, lng] polyline, in km. Flat-earth is fine at
    // this scale; the road is 500 km and the error is a few hundred metres.
    var stepKm = function(a, b) {
	var x = (b[1] - a[1]) * Math.cos((a[0] + b[0]) / 2 * Math.PI / 180);
	var y = b[0] - a[0];
	return Math.sqrt(x * x + y * y) * 111.2;
    };

    var cache = null;
    var cumulative = function(coords) {
	if (cache && cache.coords === coords) return cache.along;
	var along = [0];
	for (var i = 1; i < coords.length; i++) {
	    along.push(along[i - 1] + stepKm(coords[i - 1], coords[i]));
	}
	cache = { coords: coords, along: along };
	return along;
    };

    var lengthKm = function(coords) {
	var along = cumulative(coords);
	return along[along.length - 1];
    };

    // The point some fraction (0..1) of the way along the road.
    var pointAt = function(coords, fraction) {
	var along = cumulative(coords);
	var target = Math.max(0, Math.min(1, fraction)) * along[along.length - 1];
	var lo = 0, hi = along.length - 1;
	while (hi - lo > 1) {
	    var mid = (lo + hi) >> 1;
	    if (along[mid] <= target) lo = mid; else hi = mid;
	}
	var span = along[hi] - along[lo];
	var f = span > 0 ? (target - along[lo]) / span : 0;
	return [
	    coords[lo][0] + f * (coords[hi][0] - coords[lo][0]),
	    coords[lo][1] + f * (coords[hi][1] - coords[lo][1])
	];
    };

    // How far along the road (0..1) the nearest point to [lat, lng] is.
    var fractionOf = function(coords, latlng) {
	var along = cumulative(coords);
	var best = 0, bestD = Infinity;
	for (var i = 0; i < coords.length; i++) {
	    var d = stepKm(coords[i], latlng);
	    if (d < bestD) { bestD = d; best = i; }
	}
	return along[best] / along[along.length - 1];
    };

    return { minutes, slice, answers, departure, beats, arrival, towns,
	     beatAt, clockFor, lengthKm, pointAt, fractionOf };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = MiryamModule;
}
