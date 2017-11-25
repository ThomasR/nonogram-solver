#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const downloader = require('./downloader');

const run = args => args.map(a => +a).forEach((id, i) => {
  setTimeout(() => { // required to avoid server errors
    downloader(id, ({title, rows, columns}) => {
      let fileName = path.resolve(__dirname, `${title}.json`);
      let data = JSON.stringify({columns, rows});
      fs.readFile(fileName, (err) => {
        if (err) {
          fs.writeFile(fileName, data, (err) => {
            if (err) {
              console.error(`Error trying to save file ${fileName}`);
            } else {
              console.error(`Saved file ${fileName}`);
            }
          });
        } else {
          console.error(`File ${fileName} already exists.`);
        }
      });
    });
  }, 30 * i);
});

if (require.main === module) {
  let args = Array.from(process.argv);
  args.shift();
  let scriptName = args.shift();
  let scriptBaseName = path.basename(scriptName);

  let usageHint = `Usage: node ${scriptBaseName} id [id …].
Each id must be numeric and a nonograms.org puzzle id.`;

  if (args.length === 0 || !args.every(arg => /^[1-9][0-9]*$/.test(arg))) {
    console.error(usageHint);
    process.exit(1);
  }
  run(args);
} else {
  module.exports = run;
}
