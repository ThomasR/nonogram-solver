/**
 * all solvers in descending order by speed
 */
module.exports = [
  require('./solvers/pushSolver').solve,
  require('./solvers/bruteForceSolver').solve
];
