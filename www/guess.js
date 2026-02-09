(function() {
  var randomRange = function(start, end) {
    return Math.floor(start + (1 + end - start) * Math.random());
  };

  var misses = [
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

  var winning = [
    "You found it!",
    "Great job!",
    "There it is!",
    "What luck!",
    "You did it!",
  ];

  var makeResponse = function(lst) {
    return lst[randomRange(0, lst.length - 1)];
  };

  var sendMessage = function(message) {
    return $("#message").html(message);
  };

  var createGame = function(number) {
    $("#game-board").show();
    var secret;
    
    secret = randomRange(1, number);
    var html = ""
    for (var i=1; i <= number; i++){
      html += `<span class="guess" val="${i}">${i}</span>`;
    }
    $("#game-board").html(html);
    $(".guess").click(function(){
      var i = parseInt($(this).html());

      if (i === secret){
        sendMessage(makeResponse(winning));
        $(this).addClass("right");
        $(".guess").unbind("click");
        $("#play-again").show()
      } else {
        $(this).unbind("click");
        $(this).addClass("wrong");
        sendMessage(makeResponse(misses));
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

  // Stub out a better game object.
  var Game = function(number){
    this.number = number;
    this.secret = randomRange(1, number);
    this.guesses = new Set();

    this.board = $("#game-board");
  }

  Game.prototype.makeGuess = function(n) {
    this.guesses.add(n)
    return (n === this.secret)
  }

  Game.prototype.isComplete = function(){
    return this.guesses.has(this.secret);
  }

  $(document).ready(function() {
    $("#start_choose_number").click(choiceClick);
    $("#start_random").click(randomClick);
    $("#play-again").click(unhideMenu);
    $("input:text:visible:first").focus();

    $('input').keypress(function (e) {
      console.log(e.which);
      if (e.which == 13) {
        $('#start_choose_number').click();
      }
    });

  });
}).call(this);
