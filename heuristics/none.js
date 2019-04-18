import { solvedPuzzle } from '../matrixes'
import { isEqual } from '../helpers'

export function heuristic({ matrix }) {
    if (isEqual(matrix, solvedPuzzle.matrix)){
        return 0;
    }
    return 1;
}