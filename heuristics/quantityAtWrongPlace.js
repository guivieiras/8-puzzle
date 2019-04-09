import { solvedPuzzle } from '../matrixes';

function isAtRightPlace(number, i, j) {
	var { x, y } = solvedPuzzle.getPosition(number);
	return x == i && j == y;
}

export function heuristic(puzzle) {
	var sum = 0;

	for (var [i, arrays] of puzzle.matrix.entries()) {
		for (var [j, number] of arrays.entries()) {
			sum += isAtRightPlace(number, i, j) ? 0 : 1;
		}
	}
	return sum;
}