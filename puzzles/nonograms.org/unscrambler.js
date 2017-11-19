(function () {

  const mod = (x, [a, b, c]) => {
    return a * (x[0] % x[3]) + b * (x[1] % x[3]) + c * (x[2] % x[3]);
  };

  let data = d.slice();
  data.shift();
  const columnCount = mod(data.shift(), [1, 1, -1]);
  const rowCount = mod(data.shift(), [1, 1, -1]);
  const cutPoint = mod(data.shift(), [1, 1, -1]) + 1;
  data = data.slice(cutPoint);
  let dashInfo = data.shift();
  let dashCount = mod(dashInfo, [dashInfo[0] % dashInfo[3], 2, 1]);

  const solutions = Array(rowCount).fill(1).map(i => Array(columnCount).fill(0));
  let pivot = data.shift();
  let clearData = data.slice(0, dashCount).map(entry => entry.map((x, n) => x - pivot[n]));
  clearData.forEach(([column, length, color, row]) => {
    for (let i = 0; i < length; i++) {
      solutions[row - 1][i + column - 1] = color;
    }
  });

  let rowHints = Array(rowCount).fill(1).map(i => []);
  solutions.forEach((solution, i) => {
    for (let end = 0; end < columnCount; end++) {
      const start = end;
      const color = solution[start];
      if (!color) {
        continue;
      }
      while (end < columnCount && solution[end] === color) {
        end++;
      }
      rowHints[i].push(end - start);
    }
  });

  let columnHints = Array(columnCount).fill(1).map(i => []);
  columnHints.forEach((columnHint, i) => {
    for (let end = 0; end < rowCount; end++) {
      const start = end;
      const color = solutions[start][i];
      if (!color) {
        continue;
      }
      while (end < rowCount && solutions[end][i] === color) {
        end++;
      }
      columnHint.push(end - start);
    }
  });

  Object.assign(global, {
    rows: rowHints,
    columns: columnHints,
    content: Array.prototype.concat.apply([], solutions)
  });
})();
