const fs = require("fs");
const path = require("path");
const vm = require('vm');

const request = require('request');


const dataRE = /d *= *(\[.*?);/;
const titleRE = /«(.+?)»/;

module.exports = (id, callback) => {

  console.log(`Downloading puzzle ${id}`);
  const getCB = (error, response, body) => {
    if (error || response.statusCode !== 200) {
      throw error || new Error(`statusCode: ${response.statusCode} while downloading puzzle ${id}`);
    }
    let d = body.match(dataRE)[1];
    let title = body.match(titleRE)[1];
    const sandbox = {
      d: JSON.parse(d),
      title
    };
    sandbox.global = sandbox;
    vm.createContext(sandbox);

    fs.readFile(path.join(__dirname, 'unscrambler.js'), {encoding: 'utf-8'}, (err, src) => {
      if (err) {
        throw err;
      }
      vm.runInContext(src, sandbox);
      callback({
        title: sandbox.title,
        columns: sandbox.columns,
        rows: sandbox.rows,
        solution: sandbox.content
      });
    });
  };

  request.get(`http://www.nonograms.org/nonograms/i/${id}`, getCB);
};
