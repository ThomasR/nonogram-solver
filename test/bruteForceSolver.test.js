const path = require('path');
const expect = require('expect');

const runTestsOnJSON = require('./runTestsOnJSON');
const bruteForceSolver = require('../src/solvers/bruteForceSolver');

describe('bruteForceSolver', () => {

  describe('solving', () => {
    runTestsOnJSON(bruteForceSolver.solve, path.join(__dirname, 'bruteForce.json'));
  });
});
