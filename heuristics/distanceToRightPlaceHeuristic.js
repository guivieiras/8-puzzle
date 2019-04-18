import { solvedPuzzle } from '../matrixes';

export function distanceToRightPlace(number, i, j) {
	var { x, y } = solvedPuzzle.getPosition(number);
    var distance = Math.abs(i - x) + Math.abs(j - y);
    if (!number)
        distance = 0;
	return distance;
}

export function heuristic(puzzle) {
	var sum = 0;

	for (var [i, arrays] of puzzle.matrix.entries()) {
		for (var [j, number] of arrays.entries()) {
			sum += distanceToRightPlace(number, i, j);
		}
	}
	return sum;
}