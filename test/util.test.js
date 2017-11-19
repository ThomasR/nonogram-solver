const util = require('../src/util');
const expect = require('expect');

describe('trimLine', () => {
  describe('trimming', () => {
    it('does nothing if not needed', () => {
      let fixture = [0, 0, 0];
      let expected = [[0, 0, 0], [0], {left: [], right: []}];
      let actual = util.trimLine(fixture, [0]);
      expect(actual).toEqual(expected);
    });
    it('trims on the left', () => {
      let fixture = [-1, 1, -1, 1, 0];
      let expected = [[1, 0], [1], {"left": [-1, 1, -1], "right": []}];
      let actual = util.trimLine(fixture, [1, 1]);
      expect(actual).toEqual(expected);
    });
    it('trims on the right', () => {
      let fixture = [0, 0, -1, -1];
      let expected = [[0, 0], [1], {"left": [], "right": [-1, -1]}];
      let actual = util.trimLine(fixture, [1]);
      expect(actual).toEqual(expected);
    });
    it('handles 1s on the left rim', () => {
      let fixture = [-1, 1, 1, 0, 0, -1, -1];
      let expected = [[1, 0, 0], [1, 1], {"left": [-1, 1], "right": [-1, -1]}];
      let actual = util.trimLine(fixture, [2, 1]);
      expect(actual).toEqual(expected);
    });
    it('handles 1s on the right rim', () => {
      let fixture = [-1, -1, 0, 0, 1, 1, 1, -1, -1];
      let expected = [[0, 0, 1], [1, 1], {"left": [-1, -1], "right": [1, 1, -1, -1]}];
      let actual = util.trimLine(fixture, [1, 3]);
      expect(actual).toEqual(expected);
    });
    it('trims on both ends', () => {
      let fixture = [1, 1, -1, -1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, -1, -1, -1];
      let expected = [[1, 0, 0, 1, 0, 0, 0, 1], [2, 2, 3], {"left": [1, 1, - 1, -1, 1, 1], "right": [1, 1, -1, -1, -1]}];
      let actual = util.trimLine(fixture, [2, 4, 2, 5]);
      expect(actual).toEqual(expected);
    });
    it('handles complicated cases', () => {
      let fixture = [-1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, 0, -1, 0, -1, 1, 1, -1, 0, 0, 0, 0, 0, 0, -1, -1, -1, 1, -1, -1];
      let hints = [ 16, 2, 2, 1, 2, 1 ];
      let expected = [[0, -1, 0, -1, 1, 1, -1, 0, 0, 0, 0, 0, 0], [2, 2, 1, 2], {"left": [-1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1], "right": [-1, -1, -1, 1, -1, -1]}];
      let actual = util.trimLine(fixture, hints);
      expect(actual).toEqual(expected);
    });

    it('handles complicated cases 2', () => {
      let fixture = [-1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, -1, -1, 1, 1, -1, 0, 0, 0, 0, 0, 0, -1, -1, -1, -1, 1, -1];
      let hints = [14, 1, 2, 2, 1, 1];
      let expected = [[1, 0, 0, 0, -1, -1, 1, 1, -1, 0, 0, 0, 0, 0, 0], [1, 1, 2, 2, 1], {
        "left": [-1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        "right": [-1, -1, -1, -1, 1, -1]
      }];
      let actual = util.trimLine(fixture, hints);
      expect(actual).toEqual(expected);
    });
    it('handles complicated cases 3', () => {
      let fixture = [-1, 1, -1, -1, 1, -1, -1, -1, -1, -1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1];
      let hints = [1, 1, 2, 10, 4, 9];
      let expected = [[1, 0, 1], [1, 1], {
        "left": [-1, 1, -1, -1, 1, -1, -1, -1, -1, -1, 1],
        "right": [ 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, -1]
      }];
      let actual = util.trimLine(fixture, hints);
      expect(actual).toEqual(expected);
    });
  });
  describe('restoring', () => {
    it('restores trimmed lines', () => {
      let fixtures = [
        [0, 0, 0],
        [-1, 1, 0],
        [1, 0, -1, -1],
        [-1, -1, 0, 0, 1, -1, -1, -1]
      ];
      fixtures.forEach(line => {
        let [trimmed, hints, info] = util.trimLine(line, [1]);
        expect(util.restoreLine(trimmed, info)).toEqual(line);
      });
    });
  });
});
