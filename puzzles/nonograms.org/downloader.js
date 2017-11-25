const fs = require("fs");
const http = require('http');
const path = require("path");
const vm = require('vm');

const dataRE = /d *= *(\[.*?);/;
const titleRE = /«(.+?)»/;

module.exports = (id, callback) => {

  console.log(`Downloading puzzle ${id}`);
  const getCB = (error, {statusCode}, body) => {
    if (error || statusCode !== 200) {
      throw error || new Error(`statusCode: ${statusCode} while downloading puzzle ${id}`);
    }
    let d = body.match(dataRE)[1];
    let title = body.match(titleRE)[1];
    const sandbox = {
      d: JSON.parse(d),
      title
    };
    sandbox.global = sandbox;
    vm.createContext(sandbox);

    fs.readFile(path.resolve(__dirname, 'unscrambler.js'), {encoding: 'utf-8'}, (err, src) => {
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

  http.get(`http://www.nonograms.org/nonograms/i/${id}`, (response) => {
    let data = '';
    response.on('data', chunk => {
      data += chunk;
    });
    response.on('end', () => {
      getCB(null, response, data);
    });
  }).on('error', (err) => {
    getCB(err);
  });
};
