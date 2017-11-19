const fs = require('fs');

const allSolvers = require('./allSolvers');
const ascii = require('./serializers/ascii');
const svg = require('./serializers/svg');
const Puzzle = require('./Puzzle');
let Strategy = require('./Strategy');

module.exports = (inputFilename, outputFilename) => {
  let puzzleData = fs.readFileSync(inputFilename, 'utf-8');
  let puzzle = new Puzzle(puzzleData);
  let strategy = new Strategy(allSolvers);
  strategy.solve(puzzle);

  if (puzzle.isFinished) {
    if (puzzle.isSolved) {
      console.log('Puzzle solved!');
    } else {
      console.log('Puzzle is unsolvable 😖');
      process.exit(1);
    }
  } else {
    console.log('Could not solve puzzle');
    console.log(JSON.stringify(puzzle.snapshot));
  }
  console.log(ascii(puzzle));
  fs.writeFileSync(outputFilename, svg(puzzle));
  console.log(`Output saved to ${outputFilename}.`);
};
