# How does nonogram-solver work?

Solution of nonograms is a three-level process:

1. Solve a single line (= row or column)
2. Iterate over all lines
3. If no solution is found, use trial and error

## Solving a single line

Mostly, a line cannot be completely solved, but one or more squares can be marked as `x` or `█`. Here's how it's done:

There are [many strategies](http://www.nonograms.org/methods) for (partially) solving a Nonogram line for humans; but for a computer, only one is actually required: _Brute force_ 

> Determine all possible arrangements of blocks that comply with the rules (i.e. all possible solutions), and then for each cell, if that cell is _always_ occupied, mark it a `█`. If it is _always_ vacant, mark it a `x`.

However, this method is slow, so in practice, we use another method which I call the _push solver_:

> Push all blocks to the left as far as possible, then push all blocks to the right as far as possible, while obeying the rules. Then check for overlappings on each block and on each gap.

The push solver is way faster than the brute force solver but not perfect, yet relatively successful.

You can read more about this idea at [http://www.lancaster.ac.uk/%7Esimpsons/nonogram/theory#fastcompl]().

The number of solvers is not limited, so there might be more in the future.

## Iterating over all lines

As mentioned, there are two solvers that run on single lines. We prefer the faster one. So if possible, run the fast solver on every single row, then on every single column, and so on, until the puzzle is solved.

Only if no progress is made, run the slow solver until it makes progress, and then start over.

Once a solver has visited a line, it does not need to revisit that line until there is progress in that very line. So we remember visited lines and skip them if possible.

## Trial and Error

It may happen that a puzzle with a unique solution cannot be solved with the abovementioned approach. In this case, `nonogram-solver` uses the partial solution and randomly fills in `█` in an empty cell. Then, it starts the whole solution process with that new puzzle, and if a contradiction is encountered, that cell is known to be empty.

This continues until an iteration limit is reached or the puzzle is solved. 

Since the trial and error stage uses randomization, it might happen that certain puzzles are sometimes solved and sometimes not.

When the `-r` parameter is set, this method uses recursion up to the given depth. For example, the included sample files include `puzzles/ambiguous.json`, which requires `-r 3` or more.

## Debug Mode

Want to know what exactly is going on behind the scenes? Use the `-d` command line flag to launch in debug mode (produces a **lot** of output).
