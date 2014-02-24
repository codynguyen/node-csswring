/*jshint node:true */
'use strict';

var fs = require('fs');
var path = require('path');
var postcss = require('postcss');

var csswring = require('../index');

var fixtures = path.join(__dirname, 'fixtures');
var input = '';
var expected = '';
var opts = {};
var _loadInput = function (name) {
  return fs.readFileSync(path.join(fixtures, name + '-input.css'), {
    encoding: 'utf8'
  });
};
var _loadExpected = function (name) {
  return fs.readFileSync(path.join(fixtures, name +
    '-expected.css'), {
    encoding: 'utf8'
  });
};

exports.testPublicInterfaces = function (test) {
  test.expect(3);

  input = '.foo{color:black}';
  expected = postcss.parse(input);
  test.strictEqual(csswring.wring(input).css, expected.toString());

  opts.map = true;
  test.strictEqual(
    csswring.wring(input, opts).map,
    expected.toResult(opts).map
  );

  test.strictEqual(
    postcss().use(csswring.processor).process(input).css,
    expected.toString()
  );

  test.done();
};

exports.testRealCSS = function (test) {
  test.expect(4);

  var testCases = [
    'simple',
    'extra-semicolons',
    'empty-declarations',
    'single-charset'
  ];

  for (var i = 0, l = testCases.length; i < l; i++) {
    var testCase = testCases[i];
    input = _loadInput(testCase);
    expected = _loadExpected(testCase);
    test.strictEqual(csswring.wring(input).css, expected);
  }

  test.done();
};
