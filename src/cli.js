#!/usr/bin/env node

const program = require('commander');
const path = require('path');
const mkdirp = require('mkdirp');

const runOnFile = require('./index');
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
mkdirp(targetDir, err => {
  if (err) {
    console.error(`Could not create folder ${targetDir}`);
    process.exit(1);
  }
  program.args.forEach(inputFile => {
    console.log(`Processing ${inputFile}`);
    let baseFileName = path.basename(inputFile).replace(/\.json$/, '');
    let input = path.join(process.cwd(), inputFile);
    let output = path.join(targetDir, `${baseFileName}.svg`);
    runOnFile(input, output);
  });
});
