# Randomly select a number from a given range.
randomRange = (start, end) -> Math.floor(start + (1 + end - start) * Math.random())

# Generate a response
makeResponse = () ->
  choices = [
    "Not it!",
    "Whoopsies!",
  	"Keep trying!",
   	"You're getting warmer (maybe)",
   	"Try again!",
   	"Sadly, no.",
   	"Why can't you find it?",
   	"Guess again",
  ]
  choices[randomRange(0, choices.length)]

# Send a message to the messages element
sendMessage = (message) ->
    $("#message").html message

# Create a number box for the game.
makeNumberBox = (n) ->
  "<div class='some-number'>#{n}</div>"

# Generate an object representing the game.
createGame = (number) ->
  secret = randomRange(1, number)
  numberHtml = ""
  for e in [1..number]
    numberHtml += makeNumberBox e
  board = $("#game-board")
  board.html(numberHtml)

  numberClick = () ->
    el = $(this)
    i = parseInt(el.html())

    if not el.hasClass "clicked"
      el.addClass "clicked"
      if i == secret
        sendMessage "You got it!"
        el.addClass "right"
        $("div", board).addClass("clicked")
        $("div", board).unbind("click")
        unhideSetup()
      else
        sendMessage makeResponse()
        el.addClass "wrong"

  $("div", board).click numberClick

showBoard = () ->
  $("#game-setup").css('visibility', 'hidden')
  $("#board-wrapper").fadeTo(0, 1)
  $("#board-wrapper").css('visiblity', 'visible')
  sendMessage "Guess a number"

unhideSetup = () ->
  $("#board-wrapper").fadeTo(0, 0.1)
  $("#game-setup").css("visibility", "visible")


# Take an action when guess_choose_number is clicked.
choiceClick = () ->
  showBoard()
  n = parseInt($("#number_range").val())
  if isNaN n
    sendMessage "Please pick a number"
  else
    createGame n


# Take an action when guess_random is clicked.
randomClick = () ->
    showBoard()
    n = randomRange(10, 1000)
    createGame n

# Create bindings for the game.
$(document).ready ->

  $("#start_choose_number").click choiceClick
  $("#start_random").click randomClick




