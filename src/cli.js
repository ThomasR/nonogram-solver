#!/usr/bin/env node

const program = require('commander');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

const runOnFile = require('./index');
const ascii = require('./serializers/ascii');
const svg = require('./serializers/svg');
const version = require('../package.json').version;

const defaultOutputFolder = 'output';

const help = `
  Examples:

    $ nonogram-solver world.json
    $ nonogram-solver a.json b.json
    $ nonogram-solver -o ~/nono puzzles/*.json
`;

program
  .version(version)
  .usage('[options] <file ...>')
  .option('-o, --output-dir <dir>', `Output directory. Will be created if it does not exist. Defaults to "${defaultOutputFolder}".`, defaultOutputFolder)
  .on('--help', () => {
    console.log(help);
  })
  .parse(process.argv);

if (!program.args.length) {
  program.help(); // exits
}

let targetDir = path.join(process.cwd(), program.outputDir);

let run = inputFile => {
  console.error(`Processing ${inputFile}`);
  let input = path.join(process.cwd(), inputFile);
  let baseFileName = path.basename(inputFile).replace(/\.json$/, '');

  let {status, puzzle} = runOnFile(input);

  process.stderr.write('\x1b[1G');

  switch (status) {
  case -1:
    console.error('😖 Puzzle is unsolvable');
    return;
  case 0:
    console.error('😞 Could not solve puzzle');
    console.log(JSON.stringify(puzzle.snapshot));
    break;
  case 1:
    console.error('😊 Puzzle solved!');
    break;
  default:
    throw new Error('Unknown status');
  }
  console.log(ascii(puzzle));

  let output = path.join(targetDir, `${baseFileName}.svg`);
  fs.writeFileSync(output, svg(puzzle));
  console.error(`Output saved to ${path.relative(process.cwd(), output)}.`);
};

mkdirp(targetDir, err => {
  if (err) {
    console.error(`Could not create folder ${targetDir}`);
    process.exit(1);
  }
  program.args.forEach(run);
});
