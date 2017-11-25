const path = require('path');

const runTestsOnJSON = require('./runTestsOnJSON');
const bruteForceSolver = require('../src/solvers/bruteForceSolver');

describe('bruteForceSolver', () => {

  describe('solving', () => {
    runTestsOnJSON(bruteForceSolver.solve, path.resolve(__dirname, 'resources', 'bruteForce.json'));
  });
});
