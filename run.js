import { table } from 'table';
import { heuristic } from './heuristics/distanceToRightPlaceHeuristic';
import { sleep, isEqual } from './helpers';
import { toSolvePuzzle } from './matrixes'

var openNodes = [{ puzzle: toSolvePuzzle, heuristic: heuristic(toSolvePuzzle), parent: null }]
var biggestDronteira = 1;
var closedNodes = []
async function teste() {
    while (solved != 0) {
        var solved = Infinity;

        let lower = openNodes.reduce((prev, curr) => prev.heuristic < curr.heuristic ? prev : curr)
        closedNodes.push(lower);
        openNodes = openNodes.filter(i => i != lower);


        if (lower.heuristic == 0) {
            console.log({ closed: closedNodes.length, open: openNodes.length })
            console.log(table(lower.puzzle.matrix))
            let parent = lower.parent
            let t = 0;
            do {
                t++;
                parent = parent.parent;
            } while (parent)
            console.log(t)
            return;
        }

        let puzzles = lower.puzzle.getAllPossibleMatrixes();
        for (let m of puzzles) {
            if (closedNodes.filter(o => isEqual(o.puzzle.matrix, m.matrix)).length == 0)
                openNodes.push({ puzzle: m, heuristic: heuristic(m), parent: lower })
        }
        biggestDronteira = Math.max(openNodes.length, biggestDronteira);

    }
}

teste();