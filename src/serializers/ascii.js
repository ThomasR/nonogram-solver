let leftPad = require('left-pad');

/**
 * Draw a puzzle in ASCII art
 */
let draw = ({rowHints, columnHints, rows}) => {
  let result = '';
  let maxLength = a => a.map(x => x.length).reduce((max, i) => i > max ? i : max, 0);

  let joinedRowHints = rowHints.map(x => x.join(' '));
  let maxRowHintLength = maxLength(joinedRowHints);

  let colHints = columnHints.map(x => x.join(' '));
  let maxColHintLength = maxLength(colHints);
  colHints = colHints.map(x => leftPad(x, maxColHintLength).split(''));

  for (let i = 0; i < maxColHintLength; i++) {
    let n = colHints.map(x => x.shift()).join('');
    result += leftPad('', maxRowHintLength);
    result += ' ' + n;
    result += '\n';
  }
  result += '\n';

  rows.forEach((content, i) => {
    let art = content.map(x => {
      if (x === -1) {
        return 'x';
      }
      return ['░', '█'][x]
    }).join('');
    result += `${leftPad(joinedRowHints[i], maxRowHintLength)} ${art}`;
    result += '\n';
  });

  return result;
};

module.exports = draw;
