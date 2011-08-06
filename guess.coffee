theNumber = -1

randomRange = (start, end) -> Math.floor(start + (1 + end - start) * Math.random())

makeResponse = (n) -> {
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
  choices[randomRange(0, choices.length)
}

sendMessage = (message) ->
    $(".messages").html message

makeNumber = (n) ->
  "<div class='some-number'>#{ n }</div>"

createGame = (number) ->
  {
    secret: randomRange(1, number)
  }

$(document).ready ->
  $("#guess_submit").click( () ->
    n = parseInt($("#guess_number").val())
    if isNan n
      sendMessage "Please pick a number"
    else
      loadGame n
