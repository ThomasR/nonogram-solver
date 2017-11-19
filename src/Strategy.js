const ascii = require('./serializers/ascii');
const util = require("./util");
const Puzzle = require('./Puzzle');
const assert = require("assert");

const debugMode = process.env.hasOwnProperty('NONODEBUG');

class Strategy {
  constructor(solvers) {
    this.solvers = solvers;
  }

  solve(puzzle, withTrialAndError = true, randomize = true) {
    if (debugMode) {
      var start = Date.now();
      var statistics = Array(this.solvers.length).fill(0);
      var solutionSequence = [];

    }
    this.visited = {
      rows: Array(puzzle.height).fill(0).map(() => new Uint8Array(this.solvers.length)),
      columns: Array(puzzle.width).fill(0).map(() => new Uint8Array(this.solvers.length))
    };
    let progress;
    do {
      let snapshot = puzzle.snapshot;
      progress = false;
      this.solvers.forEach((solver, i) => {
        if (progress) {
          return;
        }
        this.solveOnce(puzzle, solver, i, solutionSequence);
        progress = puzzle.snapshot.toString() !== snapshot.toString();
        if (debugMode) {
          statistics[i]++;
        }
      });
    } while(progress);
    if (withTrialAndError && !puzzle.isFinished) {
      if (debugMode) {
        console.log('must start guessing');
      }
      let deepResult = this.guessAndConquer(puzzle, randomize);
      if (deepResult) {
        puzzle.import(deepResult);
      }
    }
    if (debugMode) {
      console.log(`Solution sequence: [${solutionSequence.join(',')}]`);
      console.log(`Time elapsed: ${Date.now() - start}ms`);
      console.log(`Runs (on puzzle) per solver: ${JSON.stringify(statistics)}`);
    }
  }

  solveOnce(puzzle, solver, solverIndex, solutionSequence) {
    let skipEarly = solver.speed === 'slow';
    let skip = false;

    let optimizeOrder = (lines, hints) => {
      let unsolvedLines = lines.reduce((result, line, index) => {
        let zeros = line.reduce((count, x) => count + (x === 0 ? 1 : 0), 0);
        if (!zeros) {
          return result;
        }
        result.push({line, index, zeros});
        return result;
      }, []);

      if (skipEarly) {
        unsolvedLines.forEach(lineMeta => {
          let {index, zeros} = lineMeta;
          let hintSum = util.hintSum(hints[index]);
          let estimate = zeros < hintSum ? 0 : Math.pow(zeros - hintSum, hints[index].length);
          lineMeta.estimate = estimate;
        });
        unsolvedLines.sort(({estimate: left}, {estimate: right}) => left - right);
      }
      return unsolvedLines;
    };

    let run = (lines, hints, onRow) => {
      let visited = onRow ?
        {current: this.visited.rows, other: this.visited.columns} :
        {current: this.visited.columns, other: this.visited.rows};
      let rearrangedLines = optimizeOrder(lines, hints);
      rearrangedLines.forEach(({line, index: i, estimate}) => {
        if (skip || visited.current[i][solverIndex]) {
          return;
        }
        if (debugMode) {
          console.log(`Running solver ${solverIndex} on ${onRow ? 'row' : 'column'} ${i}`, JSON.stringify(line.slice()), hints[i]);
          if (estimate) {
            console.log(`Estimated effort: ${estimate}`);
          }
        }
        visited.current[i][solverIndex] = 1;
        let [trimmedLine, trimmedHints, trimInfo] = util.trimLine(line, hints[i]);
        let start = Date.now();
        let newLine = solver(trimmedLine, trimmedHints);
        if (debugMode) {
          let end = Date.now();
          if (end - start > 100) {
            console.log(`Long run: ${end - start}ms`);
          }
        }

        let hasChanged = false;
        let changedLines = [];
        if (newLine) {
          newLine = util.restoreLine(newLine, trimInfo);
          line.forEach((el, i) => {
            if (el !== newLine[i]) {
              line[i] = newLine[i];
              visited.other[i].fill(0);
              if (debugMode) {
                changedLines.push(i);
              }
            }
          });
          hasChanged = changedLines.length > 0;
          skip = hasChanged && skipEarly;
        }
        if (!debugMode) {
          process.stdout.write('.');
        } else if (hasChanged) {
          console.log(`found ${newLine}`);
          console.log(ascii(puzzle));
          console.log(`Must revisit ${onRow ? 'column' : 'row'}${changedLines.length > 1 ? 's' : ''} ${changedLines.join(',')}`);
          solutionSequence.push(`(${solverIndex})${onRow ? 'r' : 'c'}${i}[${changedLines.join(',')}]`);
        }
      });
    };
    run(puzzle.rows, puzzle.rowHints, true);
    if (skip) {
      return;
    }
    run(puzzle.columns, puzzle.columnHints);
  }

  guessAndConquer(puzzle, randomize, recursionDepth = 0) {
    const maxRecursion = 2;
    const maxGuessCount = 100;
    if (puzzle.isFinished) {
      return;
    }
    let snapshot = puzzle.snapshot;
    let zeroIndexes = snapshot.reduce((result, x, i) => {
      if (x === 0) {
        result.push(i);
      }
      return result;
    }, []);
    assert(zeroIndexes.length > 0, 'Contradiction in trial and error');
    for (let i = 0; i < zeroIndexes.length && i < maxGuessCount; i++) {
      let index;
      if (randomize) {
        let random = Math.floor(Math.random() * zeroIndexes.length);
        index = zeroIndexes.splice(random, 1)[0];
      } else {
        index = zeroIndexes.shift();
      }
      snapshot[index] = 1;
      let trial = new Puzzle({
        rows: puzzle.rowHints.slice(),
        columns: puzzle.columnHints.slice(),
        content: snapshot
      });
      if (debugMode) {
        console.log(`Using trialAndError method on ${i}. zero (index ${index})`);
      }
      try {
        this.solve(trial, false);
        if (trial.isFinished) {
          if (!trial.isSolved) {
            throw new Error('Not a solution');
          }
          if (debugMode) {
            console.log(`[${recursionDepth}] Successfully guessed square ${index}=1`);
          }
          return trial;
        } else {
          snapshot[index] = 0;
        }
      } catch (e) {
        snapshot[index] = -1;
        let anotherTry = new Puzzle({
          rows: trial.rowHints,
          columns: trial.columnHints,
          content: snapshot
        });
        if (recursionDepth < maxRecursion) {
          let result = this.guessAndConquer(anotherTry, randomize, recursionDepth + 1);
          if (result) {
            if (debugMode) {
              console.log(`[${recursionDepth}] Successfully guessed square ${index}=-1`);
            }
            return result;
          }
        }
      }
    }
    return null;
  }
}

module.exports = Strategy;
