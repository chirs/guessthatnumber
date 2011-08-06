var theNumber = -1

function randomRange (N, M) {
    return Math.floor(M + (1+N-M)*Math.random())  
}

function loadGame(number){
    theNumber = randomRange(1, number);
    board = $("#game-board");

    var number_html = ""
    for (var i=1;i<=number;i++) {
	number_html += makeNumber(i);
    }

    board.html(number_html);
    $("div", board).click(function () {
	o = $(this);
	o.click = function () {};
	var guess = parseInt(o.html());
	
	if (guess == theNumber) {
	    sendMessage("You got it!");
	    o.addClass("right");
	}
	else {
	    sendMessage("Try again!");
	    o.addClass("wrong");
	}
    });
}

function makeResponse(n) {
    var l = [
	"Not it!",
	"Whoopsies!",
	"Keep trying!",
	"You're getting warmer (maybe)",
	"Try again!",
	"Sadly, no.",
	"Why can't you find it?",
	"Guess again",
	]
    return l[randomRange(0, n)]
}



function sendMessage (message) {
    $(".messages").html(message);
}

function makeNumber (n) {
    return "<div class='some-number'>" + n + "</div>"
};

$(document).ready(function () {
    $("#guess_submit").click(function () {
	var n = parseInt($("#guess_number").val());
	if (isNaN(n)) {
	    sendMessage("Please pick a number")
	}
	else {
	    loadGame(n);
	}
    });
    
});