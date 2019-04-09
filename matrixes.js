import Puzzle from './main'
export const solvedPuzzle = new Puzzle(
    [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 0]
    ]);


var lol = [new Puzzle(
    [
        [8, 3, 6],
        [1, 0, 2],
        [4, 7, 5]
    ]), new Puzzle([
        [0, 8, 7],
        [6, 5, 4],
        [3, 2, 1]
    ]), new Puzzle([
        [0, 8, 7],
        [6, 5, 4],
        [3, 2, 1]
    ])]

export const toSolvePuzzle = lol[0];
