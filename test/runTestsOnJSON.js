const fs = require('fs');
const expect = require('expect');

const asciify = line => line.join('').replace(/0/g, '░').replace(/-1/g, 'x').replace(/1/g, '█');

const formatTitle = (title, hints, line) => {
  let result = [title];
  result.push(`[${hints.join('|')}]`);
  result.push(asciify(line));
  return result.join(' ');
};

const jsonRunner = (solve, filename) => {

  const runTests = o => {
    if (o.describe) {
      describe(o.describe[0], () => {
        runTests(o.describe[1]);
      });
    }
    if (o.it) {
      let lastTitle;
      o.it.forEach(([title, hints, line, expected]) => {
        if (!expected) {
          expected = line;
          line = hints;
          hints = title;
          title = null;
        }
        lastTitle = title || lastTitle;
        it(formatTitle(lastTitle, hints, line), () => {
          let actual = solve(line, hints);
          expect(actual).toEqual(expected);
        });
      });
    }
  };

  let assets = fs.readFileSync(filename);
  assets = JSON.parse(assets);
  assets.forEach(runTests);
};

module.exports = jsonRunner;
