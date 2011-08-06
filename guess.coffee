# Future game object
game = null

# Randomly select a number from a given range.
randomRange = (start, end) -> Math.floor(start + (1 + end - start) * Math.random())

# Generate a response
makeResponse = (n) ->
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
  "<div class='some-number'>#{ n }</div>"

# Generate an object representing the game.
createGame = (number) ->
  game =
    secret: randomRange(1, number)
    numberClick: () ->
      i = $(this).val()
      if i == this.secret
        alert 'winner'
      else
        alert i

  numberHtml = (makeNumberBox(e) for e in [1..number])
  board = $("game-board")
  alert board
  alert numberHtml
  board.html("hello world")
  $('div', board).click( () -> alert "hello" )



# Take an action when guess_choose_number is clicked.
numberClick = () ->
  n = parseInt($("#number_range").val())
  if isNaN n
    alert n
    sendMessage "Please pick a number"
  else
    sendMessage n
    createGame n

# Take an action when guess_random is clicked.
randomClick = () ->
    n = randomRange(10, 1000)
    sendMessage n
    createGame n

# Create bindings for the game.
$(document).ready ->
  $("#guess_choose_number").click numberClick
  $("#guess_random").click randomClick



