var assert = require('assert');
var { randomRange, makeResponse, Game } = require('./game');

// randomRange tests
(function testRandomRangeReturnsWithinBounds() {
  for (var i = 0; i < 1000; i++) {
    var result = randomRange(1, 10);
    assert(result >= 1, 'result should be >= start');
    assert(result <= 10, 'result should be <= end');
  }
  console.log('PASS: randomRange returns values within bounds');
})();

(function testRandomRangeSingleValue() {
  for (var i = 0; i < 100; i++) {
    assert.strictEqual(randomRange(5, 5), 5);
  }
  console.log('PASS: randomRange with equal start and end returns that value');
})();

// makeResponse tests
(function testMakeResponseReturnsItemFromList() {
  var list = ["a", "b", "c"];
  for (var i = 0; i < 100; i++) {
    var result = makeResponse(list);
    assert(list.includes(result), 'result should be an item from the list');
  }
  console.log('PASS: makeResponse returns an item from the list');
})();

(function testMakeResponseSingleItem() {
  assert.strictEqual(makeResponse(["only"]), "only");
  console.log('PASS: makeResponse with single-item list returns that item');
})();

// Game tests
(function testGameInitialization() {
  var game = new Game(10);
  assert.strictEqual(game.number, 10);
  assert(game.secret >= 1 && game.secret <= 10, 'secret should be within range');
  assert.strictEqual(game.guesses.size, 0);
  console.log('PASS: Game initializes with correct state');
})();

(function testGameMakeGuessWrong() {
  var game = new Game(10);
  var wrong = game.secret === 1 ? 2 : 1;
  assert.strictEqual(game.makeGuess(wrong), false);
  assert(game.guesses.has(wrong));
  console.log('PASS: makeGuess returns false for wrong guess');
})();

(function testGameMakeGuessCorrect() {
  var game = new Game(10);
  assert.strictEqual(game.makeGuess(game.secret), true);
  assert(game.guesses.has(game.secret));
  console.log('PASS: makeGuess returns true for correct guess');
})();

(function testGameIsComplete() {
  var game = new Game(10);
  assert.strictEqual(game.isComplete(), false);
  game.makeGuess(game.secret);
  assert.strictEqual(game.isComplete(), true);
  console.log('PASS: isComplete reflects whether secret has been guessed');
})();

console.log('\nAll tests passed!');
