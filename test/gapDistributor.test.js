const expect = require('expect');

const gapDistributor = require('../src/gapDistributor');

describe('gapDistributor', () => {

  describe('distributing in empty gaps', () => {
    describe('one gap', () => {
      describe('one hint', () => {
        it('works', () => {
          let line = [0, 0, 0, 0, 0];
          let hints = [2];
          let expected = {
            gaps: [[0, 5]],
            distributions: [[[2]]]
          };
          let actual = gapDistributor(line, hints);
          expect(actual).toEqual(expected);
        });
      });
      describe('two hints', () => {
        it('works', () => {
          let line = [0, 0, 0, 0, 0];
          let hints = [2, 2];
          let expected = {
            gaps: [[0, 5]],
            distributions: [[[2, 2]]]
          };
          let actual = gapDistributor(line, hints);
          expect(actual).toEqual(expected);
        });
      });
    });
    describe('multiple gaps', () => {
      describe('one hint', () => {
        it('works with short hint', () => {
          let line = [0, 0, 0, 0, -1, 0, 0, 0];
          let hints = [2];
          let expected = {
            gaps: [[0, 4], [5, 8]],
            distributions: [[[], [2]], [[2], []]]
          };
          let actual = gapDistributor(line, hints);
          expect(actual).toEqual(expected);
        });
        it('works with long hint', () => {
          let line = [0, 0, -1, 0, 0, 0, -1, 0, 0, 0];
          let hints = [3];
          let expected = {
            gaps: [[0, 2], [3, 6], [7, 10]],
            distributions: [[[], [], [3]], [[], [3], []]]
          };
          let actual = gapDistributor(line, hints);
          expect(actual).toEqual(expected);
        });
      });
      describe('two hints', () => {
        it('works with 2,1', () => {
          let line = [0, 0, 0, 0, 0, -1, -1, 0, 0, 0, 0, 0];
          let hints = [2, 1];
          let expected = {
            gaps: [[0, 5], [7, 12]],
            distributions: [[[], [2, 1]], [[2], [1]], [[2, 1], []]]
          };
          let actual = gapDistributor(line, hints);
          expect(actual).toEqual(expected);
        });
        it('works with 2,2', () => {
          let line = [0, 0, 0, 0, 0, -1, -1, 0, 0, 0, 0, 0];
          let hints = [2, 2];
          let expected = {
            gaps: [[0, 5], [7, 12]],
            distributions: [[[], [2, 2]], [[2], [2]], [[2, 2], []]]
          };
          let actual = gapDistributor(line, hints);
          expect(actual).toEqual(expected);
        });
        it('works with 2,3', () => {
          let line = [0, 0, 0, 0, 0, -1, -1, 0, 0, 0, 0, 0];
          let hints = [2, 3];
          let expected = {
            gaps: [[0, 5], [7, 12]],
            distributions: [[[2], [3]]]
          };
          let actual = gapDistributor(line, hints);
          expect(actual).toEqual(expected);
        });
      });
    });
  });
  describe('distributing in non-empty gaps', () => {
    describe('one gap', () => {
      describe('one hint', () => {
        it('works', () => {
          let line = [0, 0, 1, 0, 0];
          let hints = [2];
          let expected = {
            gaps: [[0, 5]],
            distributions: [[[2]]]
          };
          let actual = gapDistributor(line, hints);
          expect(actual).toEqual(expected);
        });
      });
      describe('two hints', () => {
        it('works', () => {
          let line = [0, 1, 0, 0, 0];
          let hints = [2, 2];
          let expected = {
            gaps: [[0, 5]],
            distributions: [[[2, 2]]]
          };
          let actual = gapDistributor(line, hints);
          expect(actual).toEqual(expected);
        });
        it('works with impossible', () => {
          let line = [0, 0, 1, 0];
          let hints = [2, 2];
          let expected = null;
          let actual = gapDistributor(line, hints);
          expect(actual).toEqual(expected);
        });
      });
      describe('complicated case', () => {
        it('works', () => {
          let line = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1];
          let hints = [2, 2];
          let expected = null;
          let actual = gapDistributor(line, hints);
          expect(actual).toEqual(expected);

        })
      });
    });
    describe('multiple gaps', () => {
      describe('one hint', () => {
        it('works with short hint', () => {
          let line = [0, 0, 0, 0, -1, 0, 1, 0];
          let hints = [2];
          let expected = {
            gaps: [[0, 4], [5, 8]],
            distributions: [[[], [2]]]
          };
          let actual = gapDistributor(line, hints);
          expect(actual).toEqual(expected);
        });
        it('works with long hint', () => {
          let line = [0, 0, -1, 0, 1, 0, -1, 0, 0, 0];
          let hints = [3, 3];
          let expected = {
            gaps: [[0, 2], [3, 6], [7, 10]],
            distributions: [[[], [3], [3]]]
          };
          let actual = gapDistributor(line, hints);
          expect(actual).toEqual(expected);
        });
      });
      describe('two hints', () => {
        it('works with 2,1', () => {
          let line = [0, 0, 1, 0, 0, -1, -1, 0, 0, 0, 0, 0];
          let hints = [2, 1];
          let expected = {
            gaps: [[0, 5], [7, 12]],
            distributions: [[[2], [1]], [[2, 1], []]]
          };
          let actual = gapDistributor(line, hints);
          expect(actual).toEqual(expected);
        });
        it('works with 2,2', () => {
          let line = [0, 1, 0, 0, 0, -1, -1, 0, 0, 0, 1, 0];
          let hints = [2, 2];
          let expected = {
            gaps: [[0, 5], [7, 12]],
            distributions: [[[2], [2]]]
          };
          let actual = gapDistributor(line, hints);
          expect(actual).toEqual(expected);
        });
        it('works with 2,3', () => {
          let line = [0, 0, 1, 0, 0, -1, -1, 0, 0, 1, 0, 0];
          let hints = [2, 3];
          let expected = {
            gaps: [[0, 5], [7, 12]],
            distributions: [[[2], [3]]]
          };
          let actual = gapDistributor(line, hints);
          expect(actual).toEqual(expected);
        });
      });
    });
  });
});
