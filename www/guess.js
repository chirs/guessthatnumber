(function() {
    var randomRange = GameModule.randomRange;
    var makeResponse = GameModule.makeResponse;
    var missingResponses = GameModule.missingResponses;
    var hittingResponses = GameModule.hittingResponses;
    var Game = GameModule.Game; 

    var sendMessage = function(message) {
	return $("#message").html(message);
    };
    
    var createGame = function(number) {
	$("#game-board").show();

	const game = new Game(number);

	var html = "";
	for (var i=1; i <= number; i++){
	    html += `<span class="guess" val="${i}">${i}</span>`;
	}
	$("#game-board").html(html);
	
	$(".guess").click(function(){
	    var i = parseInt($(this).html());
	    
	    if (i === game.secret){
		sendMessage(makeResponse(hittingResponses));
		$(this).addClass("right");
		$(".guess").unbind("click");
		$("#play-again").show()
	    } else {
		$(this).unbind("click");
		$(this).addClass("wrong");
		var remaining = $(".guess").not(".wrong").not(".right");
		if (remaining.length === 1) {
		    sendMessage(makeResponse(hittingResponses));
		    remaining.addClass("right");
		    $(".guess").unbind("click");
		    $("#play-again").show();
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
	var rc = function () { return Math.floor(Math.random() * 1000); }
	setInterval(function() { $(".guess").not(".wrong")[rc()].click()}, 50)
    };
    
    var randomClick = function() {
	showBoard();
	return createGame(randomRange(10, 1000));
    };
    
    $(document).ready(function() {
	$("#start_choose_number").click(choiceClick);
	$("#start_random").click(randomClick);
	$("#play-again").click(unhideMenu);
	$("input:text:visible:first").focus();
	
	$('input').keypress(function (e) {
	    if (e.which == 13) {
		$('#start_choose_number').click();
	    }
	});
	
    });
}).call(this);
