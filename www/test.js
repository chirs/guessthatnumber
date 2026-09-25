var assert = require('assert');
var { randomRange, makeResponse, Game } = require('./game');
var { beats, beatFor, km } = require('./miryam');

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

// Miryam tests
(function testBeatsAreNonEmpty() {
  assert(beats.length > 0, 'there should be beats');
  beats.forEach(function(b) {
    assert(typeof b === 'string' && b.trim().length > 0, 'no blank beats');
  });
  console.log('PASS: beats are non-empty strings');
})();

(function testBeatForEndpoints() {
  assert.strictEqual(beatFor(1, km), 0);
  assert.strictEqual(beatFor(km, km), beats.length - 1);
  assert.strictEqual(beatFor(km - 1, km), beats.length - 1);
  console.log('PASS: beatFor starts at the first beat and ends at the last');
})();

(function testBeatForMonotonicAndInRange() {
  var last = 0;
  for (var i = 1; i <= km; i++) {
    var b = beatFor(i, km);
    assert(b >= 0 && b < beats.length, 'beat index in range');
    assert(b >= last, 'beat index never goes backwards');
    last = b;
  }
  console.log('PASS: beatFor is monotonic and in range');
})();

(function testBeatForTinyBoards() {
  assert.strictEqual(beatFor(1, 1), 0);
  assert.strictEqual(beatFor(1, 2), 0);
  assert.strictEqual(beatFor(2, 2), beats.length - 1);
  console.log('PASS: beatFor handles one- and two-tile boards');
})();

console.log('\nAll tests passed!');
