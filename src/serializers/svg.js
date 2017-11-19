/**
 * Draw a puzzle as an SVG image
 */


let drawHeader = (viewBox) => {
  const scaling = 20;
  return `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
    width="${scaling * viewBox[2]}" height="${scaling * viewBox[3]}"
    viewBox="${viewBox.join(' ')}">`;
};

let drawDefs = () => {
  const c = .5; // cross size
  const w = .75; // box width
  return `
    <defs>
        <style type="text/css"><![CDATA[
            #bg {
                fill: #fafcff;
            }
            .grid, #miss, .hint {
                stroke-width: .05;
                stroke-linecap: round;
                fill: none;
                stroke: hsl(0, 0%, 0%);
            }
            .grid:nth-of-type(5n + 1), .grid:last-of-type {
                stroke-width: .11;
            }
            .hint {
                stroke: hsl(0, 0%, 80%);
                fill: hsla(0, 0%, 0%, 0.01);
            }
            #hit {
                fill: hsl(200, 100%, 20%);
            }
            #miss {
                stroke: hsla(20, 40%, 45%, .7);
                stroke-width: .08;
            }
            text {
                font-family: "Source Sans Pro", Arial, sans-serif;
                font-weight: bold;
                font-size: .7px;
                text-anchor: middle;
                fill: hsl(0, 0%, 27%);
            }
        ]]></style>
        <rect id="hit" x="${-w / 2}" y="${-w / 2}" width="${w}" height="${w}"/>
        <path id="miss" class="grid" d="M${-c / 2},${-c / 2}l${c},${c}M${-c / 2},${c / 2}l${c},${-c}"/>
    </defs>
    `;
};

let drawGrid = ({width, height}) => {
  let result = '<g>';
  for (let x = 0; x <= width; x++) {
    result += `<path class="grid" d="M${x},0v${height}"/>`;
  }
  result += '</g><g>';
  for (let y = 0; y <= height; y++) {
    result += `<path class="grid" d="M0,${y}h${width}"/>`;
  }
  result += '</g>';
  return result;
};

let drawHints = ({rowHints, columnHints}) => {
  let drawHint = ({x, y, text}) => {
    return `<rect class="hint" x="${x}" y="${y}" width="1" height="1"/>
      <text x="${x + .5}" y="${y + .75}">${text}</text>`;
  };
  let result = '<g>';
  rowHints.forEach((rowHints, y) => {
    rowHints.forEach((hint, x) => {
      result += drawHint({x:x - rowHints.length - .1, y, text:hint});
    });
  });
  columnHints.forEach((colHints, x) => {
    colHints.forEach((hint, y) => {
      result += drawHint({x, y: y - colHints.length - .1, text:hint});
    });
  });
  result += '</g>';
  return result;
};

let drawState = state => {
  let result = '<g>';
  state.forEach((row, y) => {
    row.forEach((el, x) => {
      if (el) {
        result += `<use xlink:href="#${el === 1 ? 'hit' : 'miss'}" transform="translate(${x}.5,${y}.5)"/>`;
      }
    });
  });
  result += '</g>';
  return result;
};

let draw = ({rowHints, columnHints, rows}) => {
  let maxLength = a => a.map(x => x.length).reduce((max, x) => x > max ? x : max, 0);

  let deltaX = maxLength(rowHints);
  let deltaY = maxLength(columnHints);
  let width = columnHints.length;
  let height = rowHints.length;

  const rim = .5;
  let viewBox = [
    -(deltaX + rim),
    -(deltaY + rim),
    width + deltaX + 2 * rim,
    height + deltaY + 2 * rim
  ];
  let result = '';
  result += drawHeader(viewBox);
  result += drawDefs({width, height});
  result += `<rect id="bg" x="${viewBox[0]}" y="${viewBox[1]}" width="${viewBox[2]}" height="${viewBox[3]}"/>`;
  result += drawHints({rowHints, columnHints});
  result += drawGrid({width, height});
  result += drawState(rows);
  result += '</svg>';

  return result;
};

module.exports = draw;
