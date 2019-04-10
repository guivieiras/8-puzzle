import { solvedPuzzle } from '../matrixes';
import {distanceToRightPlace } from './distanceToRightPlaceHeuristic';
import {isAtRightPlace } from './quantityAtWrongPlace'

export function heuristic(puzzle) {
	var sum = 0;

	for (var [i, arrays] of puzzle.matrix.entries()) {
		for (var [j, number] of arrays.entries()) {
			var { distance, number } = distanceToRightPlace(number, i, j)
            sum += distance;
            sum += isAtRightPlace(number, i, j) ? 0 : 1;
		}
	}
	return sum;
}