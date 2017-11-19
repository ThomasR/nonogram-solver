const pushLeft = require('./solvers/pushSolver').pushLeft;

let findGaps = line => line.reduce((result, el, i, line) => {
  if (el > -1) {
    if (line[i - 1] > -1) {
      result[result.length - 1][1]++;
    } else {
      result.push([i, i + 1]);
    }
  }
  return result;
}, []);

let allWithOneGap = (line, gaps, hints) => {
  let left = gaps[0][0];
  let right = gaps[0][1];
  if (pushLeft(line.slice(left, right), hints)) {
    return {gaps, distributions: [[hints]]};
  }
  return null;
};

let gapDistributor = (line, hints) => {
  let gaps = findGaps(line);
  if (gaps.length === 1) {
    return allWithOneGap(line, gaps, hints);
  }
  let distributions = [];
  let gap = gaps[0];
  for (let hintCount = 0; hintCount <= hints.length; hintCount++) {
    let first = allWithOneGap(line, [gap], hints.slice(0, hintCount));
    if (!first) {
      continue;
    }
    let second = gapDistributor(line.slice(gap[1]), hints.slice(hintCount));
    if (!second) {
      continue;
    }
    first.distributions.forEach(x => {
      x.forEach(e => {
        second.distributions.forEach(y => {
          let item = y.slice();
          item.unshift(e);
          distributions.push(item);
        });
      });
    }, []);
  }
  return {gaps, distributions};
};

module.exports = gapDistributor;
