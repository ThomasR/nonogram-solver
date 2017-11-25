#!/usr/bin/env node

const program = require('commander');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

const version = require('../package.json').version;

const defaultOutputFolder = 'output';

const help = `
  Examples:

    $ nonogram-solver world.json
    $ nonogram-solver a.json b.json
    $ nonogram-solver -r 3 -d -o ~/nono puzzles/*.json

  Notes:

    Increasing the recursion depth value (-r) may dramatically slow down or speed up the solution process, depending on the puzzle.
    It has no effect on puzzles that don't require trial and error. For details, see
    https://github.com/ThomasR/nonogram-solver/blob/develop/doc/internals.md#trial-and-error
`;

program
  .usage('[options] <file ...>')
  .version(version)
  .option('-o, --output-dir <dir>', `Output directory. Will be created if it does not exist. Defaults to "${defaultOutputFolder}".`, defaultOutputFolder)
  .option('-r, --recursion-depth <n>', 'Set recursion depth when brute forcing puzzle. Defaults to 0.', parseInt, 0)
  .option('-d, --debug', 'Run in debug mode')
  .on('--help', () => {
    console.log(help);
  })
  .parse(process.argv);

if (!program.args.length) {
  program.help(); // exits
}

// must be after program.parse()
const runOnFile = require('./index');

let targetDir = path.resolve(process.cwd(), program.outputDir);

let run = inputFile => {
  console.error(`Processing ${inputFile}`);
  let input = path.resolve(process.cwd(), inputFile);
  let baseFileName = path.basename(inputFile).replace(/\.json$/, '');

  let {status, puzzle} = runOnFile(input);

  process.stderr.write('\x1b[1G');

  switch (status) {
  case -1:
    console.error('😖 Puzzle is unsolvable');
    return;
  case 0:
    console.error('😞 Could not solve puzzle');
    console.log(JSON.stringify(puzzle));
    break;
  case 1:
    console.error('😊 Puzzle solved!');
    break;
  default:
    throw new Error('Unknown status');
  }
  console.log(puzzle);

  let output = path.resolve(targetDir, `${baseFileName}.svg`);
  let name = path.relative(process.cwd(), output);
  fs.writeFile(output, puzzle.svg, error => {
    if (error) {
      console.error(`Could not save to ${name}`);
      process.exit(1);
    }
    console.error(`Output saved to ${name}.`);
  });
};

mkdirp(targetDir, err => {
  if (err) {
    console.error(`Could not create folder ${targetDir}`);
    process.exit(1);
  }
  program.args.forEach(run);
});
