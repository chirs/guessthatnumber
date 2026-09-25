(function() {
    var randomRange = GameModule.randomRange;
    var makeResponse = GameModule.makeResponse;
    var missingResponses = GameModule.missingResponses;
    var hittingResponses = GameModule.hittingResponses;
    var Game = GameModule.Game; 

    var sendMessage = function(message) {
	return $("#message").html(message);
    };
    
    var createGame = function(number, story) {
	$("#game-board").show();

	var winMessage = function() {
	    return story ? story.arrival : makeResponse(hittingResponses);
	};

	if (number === 0) {
	    $("#game-board").html("");
	    sendMessage(winMessage());
	    $("#play-again").show();
	    return;
	}

	const game = new Game(number);

	var html = "";
	if (number < 0) {
	    for (var i=number; i <= -1; i++){
		html += `<span class="guess" val="${i}">${i}</span>`;
	    }
	} else {
	    for (var i=1; i <= number; i++){
		html += `<span class="guess" val="${i}">${i}</span>`;
	    }
	}
	$("#game-board").html(html);
	
	$(".guess").click(function(){
	    var i = parseInt($(this).html());
	    
	    if (i === game.secret){
		sendMessage(winMessage());
		$(this).addClass("right");
		$(".guess").unbind("click");
		$("#play-again").show()
	    } else {
		$(this).unbind("click");
		$(this).addClass("wrong");
		var remaining = $(".guess").not(".wrong").not(".right");
		if (remaining.length === 1) {
		    sendMessage(winMessage());
		    remaining.addClass("right");
		    $(".guess").unbind("click");
		    $("#play-again").show();
		} else if (story) {
		    var total = $(".guess").length;
		    sendMessage(story.beats[story.beatFor(total - remaining.length, total)]);
		} else {
		    sendMessage(makeResponse(missingResponses));
		}
	    }
	});
	
    };
    
    var showBoard = function() {
	$("#menu").css('visibility', 'hidden');
	return sendMessage("Guess a number");
    };
    
    var unhideMenu = function() {
	$("body").removeClass("miryam");
	$("#play-again").html("play again");
	$("#menu").css("visibility", "visible");
	$("#game-board").hide();
	$("#play-again").hide()
    };
    
    var choiceClick = function() {
	var n = parseInt($("#number_range").val());
	if (isNaN(n)) {
	    return sendMessage("Please pick a number");
	} else {
	    showBoard();
	    sendMessage("good luck!");
	    return createGame(n);
	}
    };
    
    // For automatically playing a game.
    var autoPlay = function(){
	setInterval(function() {
	    var remaining = $(".guess").not(".wrong").not(".right");
	    if (remaining.length > 0) {
		remaining.eq(Math.floor(Math.random() * remaining.length)).click();
	    }
	}, 50);
    };
    
    var randomClick = function() {
	showBoard();
	return createGame(randomRange(10, 1000));
    };

    var miryamClick = function() {
	$("body").addClass("miryam");
	$("#play-again").html("back to delhi");
	showBoard();
	sendMessage(MiryamModule.departure);
	return createGame(MiryamModule.km, MiryamModule);
    };
    
    $(document).ready(function() {
	$("#start_choose_number").click(choiceClick);
	$("#start_random").click(randomClick);
	$("#start_miryam").click(miryamClick);
	$("#play-again").click(unhideMenu);
	$("input:text:visible:first").focus();
	
	$('input').keypress(function (e) {
	    if (e.which == 13) {
		$('#start_choose_number').click();
	    }
	});
	
    });
}).call(this);
