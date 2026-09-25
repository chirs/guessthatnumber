var MiryamModule = (function() {
    // Ten hours, they said. The bus leaves at eight.
    var minutes = 600;
    var departsAt = 20 * 60;

    // How much of the ride one question uses up, in minutes. Nobody knows.
    var slice = { min: 5, max: 30 };

    // Some questions send the bus backwards instead. This is how often.
    var setback = 1 / 6;

    // The road answers. It isn't listening.
    var answers = ["Yes.", "No."];

    var departure = "Delhi, evening. Ten hours to McLeod Ganj. Pick a number.";

    // The overnight bus, in order. Only the road and what we remember,
    // which is that it was bumpy and long.
    var beats = [
	"Delhi takes an hour to let go of us.",
	"Somewhere past the ring road the horn stops being a surprise.",
	"Panipat. Trucks in both directions, painted like temples.",
	"Pick a number. That's the game. That's the whole game.",
	"Karnal goes by as a strip of dhaba lights.",
	"Kurukshetra. A war was fought here. The bus doesn't slow down.",
	"Ambala. The road splits. We take the one that goes up.",
	"The window rattles in a rhythm you could almost count to.",
	"Chandigarh is a bypass in the dark, sodium orange, then gone.",
	"Ropar. The river is out there somewhere, black on black.",
	"Kiratpur. The road starts to turn, then it doesn't stop turning.",
	"Every bump lands in a different vertebra.",
	"Una. Half asleep, half awake, all of it bouncing.",
	"Still guessing. Hours of this.",
	"Grey in the window. Not light yet, but the idea of light.",
	"The Kangra valley opens up and the mountains are just there.",
	"Kangra. The road climbs and keeps climbing.",
	"Dharamsala. The bus empties. We stay on.",
	"The last climb. Switchbacks and prayer flags.",
	"Pine trees, cold air. None of it familiar."
    ];

    var arrival = "McLeod Ganj. We're here.";

    // What the road says when the bus goes backwards.
    var setbacks = [
	"Wrong turn at the bypass. The driver reverses through oncoming traffic.",
	"Puncture. Everyone out. The spare is flatter than the tyre.",
	"The conductor left someone at the dhaba. We go back for him.",
	"Checkpoint. Papers. A long conversation, then a longer one.",
	"Road closed. The detour goes through a village that is asleep.",
	"The engine dies on a hill. We roll back to where it's flat."
    ];

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

    return { minutes, slice, setback, setbacks, answers, departure, beats,
	     arrival, towns, beatAt, clockFor, lengthKm, pointAt, fractionOf };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = MiryamModule;
}
