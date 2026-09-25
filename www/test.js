var assert = require('assert');
var { randomRange, makeResponse, Game } = require('./game');
var { beats, beatAt, minutes, slice, setback, setbacks, clockFor, arrivalFor, lengthKm, pointAt, fractionOf, towns } = require('./miryam');
var RouteData = require('./route');

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

(function testBeatAtEndpoints() {
  assert.strictEqual(beatAt(0), 0);
  assert.strictEqual(beatAt(1), beats.length - 1);
  assert.strictEqual(beatAt(1.5), beats.length - 1);
  console.log('PASS: beatAt starts at the first beat and ends at the last');
})();

(function testBeatAtMonotonicAndInRange() {
  var last = 0;
  for (var f = 0; f <= 1; f += 0.01) {
    var b = beatAt(f);
    assert(b >= 0 && b < beats.length, 'beat index in range');
    assert(b >= last, 'beat index never goes backwards');
    last = b;
  }
  console.log('PASS: beatAt is monotonic and in range');
})();

(function testSliceIsAFewQuestionsAnHour() {
  assert(slice.min > 0 && slice.max > slice.min, 'slice is a range');
  assert(slice.max <= minutes / 20, 'no single question eats more than 5% of the ride');
  console.log('PASS: a question uses between ' + slice.min + ' and ' + slice.max + ' minutes');
})();

(function testSetbacksAreRareAndHaveWords() {
  assert(setback > 0 && setback < 0.5, 'the bus mostly goes forward');
  assert(setbacks.length >= 3, 'enough setbacks not to repeat at once');
  setbacks.forEach(function(s) { assert(typeof s === 'string' && s.length > 0, 'setback has words'); });
  console.log('PASS: about 1 in ' + Math.round(1 / setback) + ' questions sends the bus back');
})();

(function testClockRunsEightToSix() {
  assert.strictEqual(clockFor(0), '8:00 pm');
  assert.strictEqual(clockFor(245), '12:05 am');
  assert.strictEqual(clockFor(minutes), '6:00 am');
  console.log('PASS: clock runs from 8 pm to 6 am');
})();

(function testArrivalSaysBothNumbers() {
  assert.strictEqual(arrivalFor(30, 41), "McLeod Ganj. We're here. 41 questions. You said 30.");
  assert.strictEqual(arrivalFor(1, 1), "McLeod Ganj. We're here. 1 question. You said 1.");
  console.log('PASS: arrival gives the count next to the guess');
})();

// Road tests
(function testRoadLengthMatchesTheRouter() {
  var km = lengthKm(RouteData.coords);
  assert(Math.abs(km - RouteData.km) / RouteData.km < 0.03, 'measured ' + km + ' vs ' + RouteData.km);
  console.log('PASS: the road measures about ' + Math.round(km) + ' km');
})();

(function testPointAtEnds() {
  var c = RouteData.coords;
  assert.deepStrictEqual(pointAt(c, 0), c[0]);
  assert.deepStrictEqual(pointAt(c, 1), c[c.length - 1]);
  assert.deepStrictEqual(pointAt(c, -1), c[0]);
  assert.deepStrictEqual(pointAt(c, 2), c[c.length - 1]);
  console.log('PASS: pointAt starts in Delhi and ends in McLeod Ganj');
})();

(function testTownsSitAlongTheRoadInOrder() {
  var c = RouteData.coords;
  var last = -1;
  towns.forEach(function(t) {
    var f = fractionOf(c, [t.lat, t.lng]);
    assert(f > last, t.name + ' comes after the town before it');
    last = f;
  });
  assert(fractionOf(c, [towns[0].lat, towns[0].lng]) < 0.02, 'Delhi is at the start');
  assert(last > 0.98, 'McLeod Ganj is at the end');
  var chandigarh = towns.filter(function(t) { return t.name === 'Chandigarh'; })[0];
  var f = fractionOf(c, [chandigarh.lat, chandigarh.lng]);
  assert(f > 0.4 && f < 0.6, 'Chandigarh is about halfway, got ' + f);
  console.log('PASS: the towns sit along the road in order');
})();

console.log('\nAll tests passed!');
