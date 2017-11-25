const child_process = require('child_process');
const expect = require('expect');
const path = require('path');
const rimraf = require('rimraf');
const fs = require('fs');

const cli = path.resolve(__dirname, '..', 'src', 'cli.js');

describe('CLI', () => {
  afterEach(done => {
    rimraf(path.resolve(__dirname, 'output'), done);
  });

  it('prints help', done => {
    child_process.execFile(cli, (error, stdout, stderr) => {
      if (error) {
        done(error);
        return;
      }
      expect(stderr).toBeFalsy();
      expect(stdout).toMatch('Usage:');
      expect(stdout).toMatch('Options:');
      expect(stdout).toMatch('Examples:');
      done();
    });
  });

  it('throws an error if file does not exist', done => {
    child_process.execFile(cli, ['nonexistent.json'], error => {
      if (error) {
        done();
      } else {
        done(new Error('Process should produce an error'));
      }
    });
  });

  it('Solves the given puzzle', done => {
    let filename = path.resolve(__dirname, 'resources', 'easyPuzzle.json');
    child_process.execFile(cli, [filename], { cwd: __dirname }, (error, stdout, stderr) => {
      if (error) {
        done(error);
        return;
      }
      expect(stdout).toMatch(/^\s*1\s*1\s*█\s*$/);
      expect(stderr).toMatch(/Processing.*easyPuzzle\.json/);
      expect(stderr).toMatch('solved');
      fs.readFile(path.resolve(__dirname, 'output', 'easyPuzzle.svg'), done);
    });
  });

  it('Rejects invalid puzzles', done => {
    let filename = path.resolve(__dirname, 'resources', 'invalidPuzzle.json');
    child_process.execFile(cli, [filename], { cwd: __dirname }, (error, stdout, stderr) => {
      if (!error) {
        done(new Error('Should throw an error'));
        return;
      }
      expect(stderr).toMatch(/Processing.*invalidPuzzle\.json/);
      expect(stderr).toMatch('Invalid hint data');
      expect(stdout).toBeFalsy();
      fs.readFile(path.resolve(__dirname, 'output', 'invalidPuzzle.svg'), err => {
        if (err.code === 'ENOENT') {
          done();
        } else {
          done(new Error('Unexpected output file'));
        }
      });
    });
  });

  it('Detects unsolvable puzzles', done => {
    let filename = path.resolve(__dirname, 'resources', 'unsolvablePuzzle.json');
    child_process.execFile(cli, [filename], { cwd: __dirname }, (error, stdout, stderr) => {
      if (error) {
        done(error);
        return;
      }
      expect(stderr).toMatch(/Processing.*unsolvablePuzzle\.json/);
      expect(stderr).toMatch('unsolvable');
      expect(stdout).toBeFalsy();
      fs.readFile(path.resolve(__dirname, 'output', 'unsolvablePuzzle.svg'), err => {
        if (err.code === 'ENOENT') {
          done();
        } else {
          done(new Error('Unexpected output file'));
        }
      });
    });
  });

  it('gives up on hard puzzles', done => {
    let filename = path.resolve(__dirname, 'resources', 'ambiguousPuzzle.json');
    child_process.execFile(cli, [filename], { cwd: __dirname }, (error, stdout, stderr) => {
      if (error) {
        done(error);
        return;
      }
      expect(stderr).toMatch(/Processing.*ambiguousPuzzle\.json/);
      expect(stderr).toMatch('Could not solve');
      expect(stdout).toMatch(/\[0,-1,0,-1,0,-1,0,-1,0,-1,0,-1,0,-1,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,-1,0,-1,0,-1,0,-1,0,-1,0,-1,0,-1,0]/);
      expect(stdout).toMatch(/^\s*1 1 1 1 1 1 1 1\s*1 1 1 1 *░x░x░x░x░x░x░x░\s*xxxxxxxxxxxxxxx\s*1 1 1 1 *░x░x░x░x░x░x░x░$/m);
      fs.readFile(path.resolve(__dirname, 'output', 'ambiguousPuzzle.svg'), done);
    });
  });

  it('allows setting the output folder', done => {
    let filename = path.resolve(__dirname, 'resources', 'easyPuzzle.json');
    let outputFolder = path.resolve(__dirname, 'output', 'foo');
    child_process.execFile(cli, ['-o', outputFolder, filename], { cwd: __dirname }, error => {
      if (error) {
        done(error);
        return;
      }
      fs.readFile(path.resolve(__dirname, 'output', 'foo', 'easyPuzzle.svg'), done);
    });
  });

  it('takes multiple input files', done => {
    let filename1 = path.resolve(__dirname, 'resources', 'easyPuzzle.json');
    let filename2 = path.resolve(__dirname, 'resources', 'easyPuzzle-2.json');
    child_process.execFile(cli, [filename1, filename2], { cwd: __dirname }, error => {
      if (error) {
        done(error);
        return;
      }
      fs.readFile(path.resolve(__dirname, 'output', 'easyPuzzle.svg'), error => {
        if (error) {
          done(error);
          return;
        }
        fs.readFile(path.resolve(__dirname, 'output', 'easyPuzzle-2.svg'), done);
      });
    });
  });

  it('supports debug mode', done => {
    let filename = path.resolve(__dirname, 'resources', 'easyPuzzle.json');
    child_process.execFile(cli, ['-d', filename], { cwd: __dirname }, (error, stdout, stderr) => {
      if (error) {
        done(error);
        return;
      }
      expect(stdout).toMatch('Running solver 0 on row 0');
      expect(stdout).toMatch('Must revisit column 0');
      expect(stdout).toMatch('Solution sequence:');
      expect(stdout).toMatch(/Time elapsed: \d+ms/);
      expect(stdout).toMatch(/Runs.*: \[\d+(, *\d+)*]/);
      expect(stderr).toMatch('solved');
      done();
    });
  });

  it('allows setting recursion depth', done => {
    let filename = path.resolve(__dirname, 'resources', 'ambiguousPuzzle.json');
    child_process.execFile(cli, ['-r', '2', filename], { cwd: __dirname }, (error, stdout, stderr) => {
      if (error) {
        done(error);
        return;
      }
      expect(stderr).toMatch('Could not solve');
      let filename = path.resolve(__dirname, 'resources', 'ambiguousPuzzle.json');
      child_process.execFile(cli, ['-r', '3', filename], { cwd: __dirname }, (error, stdout, stderr) => {
        if (error) {
          done(error);
          return;
        }
        expect(stderr).toMatch('solved');
        done();
      });
    });
  }).timeout(20 * 1000);
});
