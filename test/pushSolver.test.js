const expect = require('expect');

const pushSolver = require('../src/solvers/pushSolver');

describe('pushSolver', () => {

  describe('left pushing', () => {
    describe('without gaps', () => {
      it('works with a single hint on an empty line', () => {
        let line = [0, 0, 0, 0, 0];
        let hints = [3];
        let expected = [1, 1, 1, 0, 0];
        let actual = pushSolver.pushLeft(line, hints);
        expect(actual).toEqual(expected);

        line = [0, 0, 0];
        hints = [3];
        expected = [1, 1, 1];
        actual = pushSolver.pushLeft(line, hints);
        expect(actual).toEqual(expected);

        line = [0, 0];
        hints = [3];
        expected = null;
        actual = pushSolver.pushLeft(line, hints);
        expect(actual).toEqual(expected);
      });

      it('works with multiple hints on an empty line', () => {
        let line = [0, 0, 0, 0, 0];
        let hints = [1, 2];
        let expected = [1, 0, 1, 1, 0];
        let actual = pushSolver.pushLeft(line, hints);
        expect(actual).toEqual(expected);

        line = [0, 0, 0, 0, 0, 0, 0, 0];
        hints = [3, 1, 1];
        expected = [1, 1, 1, 0, 1, 0, 1, 0];
        actual = pushSolver.pushLeft(line, hints);
        expect(actual).toEqual(expected);

        line = [0, 0, 0, 0];
        hints = [2, 2];
        expected = null;
        actual = pushSolver.pushLeft(line, hints);
        expect(actual).toEqual(expected);
      });

      it('works with a single hint on a partially filled line', () => {
        let line = [0, 1, 0, 0, 0];
        let hints = [3];
        let expected = [1, 1, 1, 0, 0];
        let actual = pushSolver.pushLeft(line, hints);
        expect(actual).toEqual(expected);

        line = [0, 1, 0];
        hints = [3];
        expected = [1, 1, 1];
        actual = pushSolver.pushLeft(line, hints);
        expect(actual).toEqual(expected);

        line = [0, 0, 0, 1, 0, 0];
        hints = [3];
        expected = [0, 1, 1, 1, 0, 0];
        actual = pushSolver.pushLeft(line, hints);
        expect(actual).toEqual(expected);

        line = [0, 1, 0, 1, 0, 0];
        hints = [2];
        expected = null;
        actual = pushSolver.pushLeft(line, hints);
        expect(actual).toEqual(expected);

        line = [0, 0, 0, 1, 1, 0];
        hints = [3];
        expected = [0, 0, 1, 1, 1, 0];
        actual = pushSolver.pushLeft(line, hints);
        expect(actual).toEqual(expected);

        line = [0, 0, 1, 0, 1, 0];
        hints = [4];
        expected = [0, 1, 1, 1, 1, 0];
        actual = pushSolver.pushLeft(line, hints);
        expect(actual).toEqual(expected);

        line = [0, 1];
        hints = [3];
        expected = null;
        actual = pushSolver.pushLeft(line, hints);
        expect(actual).toEqual(expected);

        line = [1, 0, 1, 0, 1, 0, 1];
        hints = [2];
        expected = null;
        actual = pushSolver.pushLeft(line, hints);
        expect(actual).toEqual(expected);
      });

      it('works with multiple hints on a partially filled line', () => {
        let line = [0, 1, 0, 0, 0];
        let hints = [3, 1];
        let expected = [1, 1, 1, 0, 1];
        let actual = pushSolver.pushLeft(line, hints);
        expect(actual).toEqual(expected);

        line = [0, 1, 0, 0, 0, 0, 0];
        hints = [3, 2];
        expected = [1, 1, 1, 0, 1, 1, 0];
        actual = pushSolver.pushLeft(line, hints);
        expect(actual).toEqual(expected);

        line = [0, 1, 0, 1, 0, 1];
        hints = [3, 1];
        expected = [0, 1, 1, 1, 0, 1];
        actual = pushSolver.pushLeft(line, hints);
        expect(actual).toEqual(expected);

        line = [0, 0, 0, 1, 1, 0, 0, 0, 0];
        hints = [2, 3, 1];
        expected = [1, 1, 0, 1, 1, 1, 0, 1, 0];
        actual = pushSolver.pushLeft(line, hints);
        expect(actual).toEqual(expected);

        line = [0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0];
        hints = [3, 3, 1];
        expected = [0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0];
        actual = pushSolver.pushLeft(line, hints);
        expect(actual).toEqual(expected);

        line = [0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1];
        hints = [3, 3, 1];
        expected = null;
        actual = pushSolver.pushLeft(line, hints);
        expect(actual).toEqual(expected);

      });

    });
    describe('with gaps', () => {
      it('works with one gap and occupation', () => {
        let line = [0, 0, -1, 0, 1];
        let hints = [1];
        let expected = [-1, -1, -1, -1, 1];
        let actual = pushSolver.solve(line, hints);
        expect(actual).toEqual(expected);
      });
    });
  });

  describe('solving', () => {
    describe('without gaps', () => {
      it('works with empty line and one hint', () => {
        let line = [0, 0, 0, 0, 0];
        let hints = [3];
        let expected = [0, 0, 1, 0, 0];
        let actual = pushSolver.solve(line, hints);
        expect(actual).toEqual(expected);

        line = [0, 0, 0, 0, 0];
        hints = [4];
        expected = [0, 1, 1, 1, 0];
        actual = pushSolver.solve(line, hints);
        expect(actual).toEqual(expected);

        line = [0, 0, 0, 0, 0];
        hints = [5];
        expected = [1, 1, 1, 1, 1];
        actual = pushSolver.solve(line, hints);
        expect(actual).toEqual(expected);

        line = [0, 0, 0, 0, 0];
        hints = [2];
        expected = [0, 0, 0, 0, 0];
        actual = pushSolver.solve(line, hints);
        expect(actual).toEqual(expected);
      });

      it('works with empty line and multiple hints', () => {
        let line = [0, 0, 0, 0, 0, 0];
        let hints = [2, 2];
        let expected = [0, 1, 0, 0, 1, 0];
        let actual = pushSolver.solve(line, hints);
        expect(actual).toEqual(expected);

        line = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        hints = [4, 1, 1];
        expected = [0, 0, 1, 1, 0, 0, 0, 0, 0, 0];
        actual = pushSolver.solve(line, hints);
        expect(actual).toEqual(expected);

        line = [0, 0, 0, 0, 0, 0];
        hints = [2, 1];
        expected = [0, 0, 0, 0, 0, 0];
        actual = pushSolver.solve(line, hints);
        expect(actual).toEqual(expected);
      });

      it('works with partially filled line and one hint', () => {
        let line = [0, 1, 0, 0, 0, 0];
        let hints = [3];
        let expected = [0, 1, 1, 0, -1, -1];
        let actual = pushSolver.solve(line, hints);
        expect(actual).toEqual(expected);

        line = [1, 0, 0, 0, 0];
        hints = [3];
        expected = [1, 1, 1, -1, -1];
        actual = pushSolver.solve(line, hints);
        expect(actual).toEqual(expected);

        line = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0];
        hints = [4];
        expected = [-1, 0, 0, 0, 1, 0, 0, 0, -1, -1];
        actual = pushSolver.solve(line, hints);
        expect(actual).toEqual(expected);

        line = [0, 0, 0, 0, 1, 0, 1, 0, 0, 0];
        hints = [4];
        expected = [-1, -1, -1, 0, 1, 1, 1, 0, -1, -1];
        actual = pushSolver.solve(line, hints);
        expect(actual).toEqual(expected);
      });

      it('works with partially filled line and multiple hints', () => {
        let line = [0, 1, 0, 0, 0, 0, 1, 0];
        let hints = [3, 3];
        let expected = [0, 1, 1, 0, 0, 1, 1, 0];
        let actual = pushSolver.solve(line, hints);
        expect(actual).toEqual(expected);

        line = [0, 1, 0, 0, 0, 1, 0];
        hints = [3, 3];
        expected = [1, 1, 1, -1, 1, 1, 1];
        actual = pushSolver.solve(line, hints);
        expect(actual).toEqual(expected);

        line = [1, 0, 0, 0, 0, 1];
        hints = [3, 2];
        expected = [1, 1, 1, -1, 1, 1];
        actual = pushSolver.solve(line, hints);
        expect(actual).toEqual(expected);

        line = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0];
        hints = [4, 1];
        expected = [-1, 0, 0, 0, 1, 0, 0, 0, 0, 0];
        actual = pushSolver.solve(line, hints);
        expect(actual).toEqual(expected);

        line = [0, 0, 0, 0, 1, 0, 1, 0, 0, 0];
        hints = [4, 2];
        expected = [-1, 0, 0, 1, 1, 0, 1, 0, 0, 0];
        actual = pushSolver.solve(line, hints);
        expect(actual).toEqual(expected);
      });
    });

    describe('with gaps', () => {
      it('works with one gap and some occupation and one hint', () => {
        let line = [0, 0, -1, 0, 1];
        let hints = [1];
        let expected = [-1, -1, -1, -1, 1];
        let actual = pushSolver.solve(line, hints);
        expect(actual).toEqual(expected);
      });

      it('works with multiple gaps and some occupation and multiple hints', () => {
        let line = [0, 0, 0, -1, 1, 0, 0, -1, 0, 0, 0];
        let hints = [3, 1, 3];
        let expected = [1, 1, 1, -1, 1, -1, -1, -1, 1, 1, 1];
        let actual = pushSolver.solve(line, hints);
        expect(actual).toEqual(expected);
      });

      it('works with multiple gaps and some occupation and multiple hints 2', () => {
        let line = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, -1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0];
        let hints = [2, 3, 7];
        let expected = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, -1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0];
        let actual = pushSolver.solve(line, hints);
        expect(actual).toEqual(expected);
      });
      it('works with multiple gaps and some occupation and multiple hints 3', () => {
        let line = [-1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, -1, -1, 1, 1, -1, 0, 0, 0, 0, 0, 0, -1, -1, -1, -1, 1, -1];
        let hints = [14, 1, 2, 2, 1, 1];
        let expected =  [-1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, 0, 0, -1, -1, 1, 1, -1, 0, 0, 0, 0, 0, 0, -1, -1, -1, -1, 1, -1];
        let actual = pushSolver.solve(line, hints);
        expect(actual).toEqual(expected);
      });
    });
  });
});
