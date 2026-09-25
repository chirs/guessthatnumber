(function() {
    var randomRange = GameModule.randomRange;
    var M = MiryamModule;
    var road = RouteData.coords;

    var elapsed, marker, cuts;

    var sendMessage = function(message) {
	return $("#message").html(message);
    };

    // Underneath: the whole road on the real map. Only the bus moves.
    var drawMap = function() {
	var map = L.map("map", {
	    zoomControl: false, dragging: false, scrollWheelZoom: false,
	    doubleClickZoom: false, touchZoom: false, boxZoom: false, keyboard: false,
	    preferCanvas: true
	});
	L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
	    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	    maxZoom: 19
	}).addTo(map);
	L.polyline(road, { color: "#d0021b", weight: 5, opacity: 1 }).addTo(map);
	// The road keeps the left third to itself; the numbers get the rest.
	map.fitBounds(L.latLngBounds(road), {
	    paddingTopLeft: [40, 40],
	    paddingBottomRight: [window.innerWidth * 0.65, 40]
	});
	// Both ends named as the road signs name them, Hindi over English.
	var end = function(at, html, dir) {
	    L.tooltip({ permanent: true, direction: dir, className: "end", offset: [dir === "right" ? 10 : -10, 0] })
		.setLatLng(at).setContent(html).addTo(map);
	};
	end(road[0], "दिल्ली<br>Delhi", "right");
	end(road[road.length - 1], "मैक्लोडगंज<br>McLeod Ganj", "right");
	cuts = L.layerGroup().addTo(map);
	marker = L.circleMarker(road[0], {
	    radius: 7, color: "#fff", weight: 2, fillColor: "#ff8c1a", fillOpacity: 1
	}).addTo(map);
    };

    var moveBus = function() {
	marker.setLatLng(M.pointAt(road, elapsed / M.minutes));
	$("#clock").text(M.clockFor(elapsed));
    };

    // The board: the smallest square that holds n, filled in order; whatever
    // doesn't fill is left empty.
    var drawPad = function(n) {
	var side = Math.ceil(Math.sqrt(n));
	var pad = $("#pad")[0];
	pad.style.setProperty("--side", side);
	pad.style.setProperty("--fit", n < 10 ? 0.4 : n < 100 ? 0.34 : n < 1000 ? 0.28 : 0.22);
	var html = "";
	for (var i = 1; i <= n; i++) html += '<span class="n" style="--i:' + i + '">' + i + "</span>";
	$("#pad").html(html);
    };

    // You say how many numbers there are. Then there are that many.
    var howMany, secret;

    // n numbers cut the road into n equal stretches: n - 1 cuts. Past 512
    // they'd paint over the road, so the road is left alone.
    var drawCuts = function(n) {
	cuts.clearLayers();
	if (n > 512) return;
	var few = n <= 64;
	for (var i = 1; i < n; i++) {
	    L.circleMarker(M.pointAt(road, i / n), {
		radius: few ? 4 : 1.5, color: "#fff", weight: few ? 1.5 : 0,
		fillColor: few ? "#1d1d1b" : "#fff", fillOpacity: 1
	    }).addTo(cuts);
	}
    };

    // One at a time, 1 to 1024, from 12.
    var step = function() {
	howMany = Math.min(1024, Math.max(1, howMany + Number($(this).data("by"))));
	$("#howmany").text(howMany);
	drawCuts(howMany);
    };

    var board = function() {
	$("body").removeClass("start");
	secret = randomRange(1, howMany);
	drawPad(howMany);
	sendMessage(M.departure);
    };

    // One number is the right one. Pick it and the bus is in McLeod Ganj;
    // pick any other and it lands on a random cut short of the end.
    var ask = function() {
	if (elapsed >= M.minutes || $(this).hasClass("asked")) return;
	$(this).addClass("asked");
	var it = Number($(this).text());

	if (it === secret) {
	    elapsed = M.minutes;
	    moveBus();
	    sendMessage("");
	    celebrate(this);
	    return;
	}
	var k = randomRange(1, howMany - 1);
	var back = k / howMany < elapsed / M.minutes;
	elapsed = k / howMany * M.minutes;
	moveBus();
	var line = back ? M.setbacks[Math.floor(Math.random() * M.setbacks.length)]
			: M.beats[M.beatAt(k / howMany)];
	sendMessage("No. " + line);
    };

    // The last milestone: McLeod Ganj, and you win. Nothing flashes.
    var celebrate = function(box) {
	$(box).removeClass("asked").addClass("right");
	$("#play-again").html('<span class="top">मैक्लोडगंज · McLeod Ganj</span>You win.').show();
    };

    // Back at the stand in Delhi, engine running.
    var deal = function() {
	$("#play-again").hide();
	$("#pad").empty();
	elapsed = 0;
	moveBus();
	sendMessage("");
	$("body").addClass("start");
	howMany = 12;
	$("#howmany").text(howMany);
	drawCuts(howMany);
    };

    // For riding the bus without lifting a finger.
    var autoPlay = function() {
	setInterval(function() {
	    var pad = $("#pad .n");
	    pad.eq(randomRange(0, pad.length - 1)).click();
	}, 50);
    };

    $(document).ready(function() {
	drawMap();
	$("#pad").on("click", ".n", ask);
	$("#ask").text(M.howMany);
	$("#start .step").click(step);
	$("#go").click(board);
	$("#play-again").click(deal);
	deal();
    });
}).call(this);
