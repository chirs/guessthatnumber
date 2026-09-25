(function() {
    var randomRange = GameModule.randomRange;
    var M = MiryamModule;
    var road = RouteData.coords;
    var km = M.lengthKm(road);

    var elapsed, bus, togo;

    var sendMessage = function(message) {
	return $("#message").html(message);
    };

    // The background: the whole road on the real map. Nothing moves here.
    var drawMap = function() {
	var map = L.map("map", {
	    zoomControl: false, dragging: false, scrollWheelZoom: false,
	    doubleClickZoom: false, touchZoom: false, boxZoom: false, keyboard: false
	});
	L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
	    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	    maxZoom: 19
	}).addTo(map);
	L.polyline(road, { color: "#1f3a93", weight: 4, opacity: 0.8 }).addTo(map);
	map.fitBounds(L.latLngBounds(road), { padding: [40, 40] });
    };

    // The diagram: Delhi at the bottom, McLeod Ganj at the top, the towns at
    // their true share of the road. The bus climbs it.
    var top = 24, bottom = 576, x = 60;
    var yAt = function(fraction) { return bottom - fraction * (bottom - top); };

    var svg = function(tag, attrs, text) {
	var el = document.createElementNS("http://www.w3.org/2000/svg", tag);
	for (var k in attrs) el.setAttribute(k, attrs[k]);
	if (text) el.textContent = text;
	return el;
    };

    var drawTrack = function() {
	var root = svg("svg", { viewBox: "0 0 220 600", preserveAspectRatio: "xMidYMid meet" });
	root.appendChild(svg("line", { "class": "road", x1: x, y1: bottom, x2: x, y2: top }));

	// Labels can't overlap, even where the towns do.
	var labelY = -Infinity;
	M.towns.slice().reverse().forEach(function(t) {
	    var y = yAt(M.fractionOf(road, [t.lat, t.lng]));
	    labelY = Math.max(y, labelY + 14);
	    root.appendChild(svg("circle", { "class": "town", cx: x, cy: y, r: 4 }));
	    root.appendChild(svg("text", { "class": "label", x: x + 14, y: labelY + 4 }, t.name));
	});

	bus = svg("circle", { "class": "bus", cx: x, cy: bottom, r: 7 });
	togo = svg("text", { "class": "togo", x: x - 14, y: bottom + 4 });
	root.appendChild(bus);
	root.appendChild(togo);
	$("#track").empty().append(root);
    };

    var moveBus = function() {
	var fraction = elapsed / M.minutes;
	var y = yAt(fraction);
	bus.setAttribute("cy", y);
	togo.setAttribute("y", y + 4);
	togo.textContent = Math.round(km * (1 - fraction)) + " km";
	$("#clock").text(M.clockFor(elapsed));
    };

    // Ask the road if it's this number. It says yes or no. It doesn't matter.
    var ask = function() {
	if (elapsed >= M.minutes) return;
	elapsed = Math.min(M.minutes, elapsed + randomRange(M.slice.min, M.slice.max));
	moveBus();

	if (elapsed >= M.minutes) {
	    sendMessage(M.arrival);
	    $("#play-again").show();
	    return;
	}
	var answer = M.answers[Math.floor(Math.random() * M.answers.length)];
	sendMessage(answer + " " + M.beats[M.beatAt(elapsed / M.minutes)]);
    };

    // Back at the stand in Delhi, engine running.
    var deal = function() {
	$("#play-again").hide();
	elapsed = 0;
	moveBus();
	sendMessage(M.departure);
    };

    // For riding the bus without lifting a finger.
    var autoPlay = function() {
	setInterval(function() {
	    $("#pad .n").eq(randomRange(0, 99)).click();
	}, 50);
    };

    $(document).ready(function() {
	drawMap();
	drawTrack();
	var html = "";
	for (var i = 1; i <= 100; i++) html += '<span class="n">' + i + "</span>";
	$("#pad").html(html).on("click", ".n", ask);
	$("#play-again").click(deal);
	deal();
    });
}).call(this);
