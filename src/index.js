#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const runOnFile = require('./runOnFile');

let targetDir = path.join(__dirname, '..', 'output');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir);
}

runOnFile(path.join(__dirname, '..', 'puzzles', 'input.json'), path.join(targetDir, 'result.svg'));
