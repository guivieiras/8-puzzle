import { table } from 'table';
//Para alternar entre heurísticas, 
import { heuristic } from './heuristics/distanceToRightPlaceHeuristic';
import { sleep, isEqual } from './helpers';
import { toSolvePuzzle } from './matrixes'

var openNodes = [{ puzzle: toSolvePuzzle, heuristic: heuristic(toSolvePuzzle), parent: null }]
var maiorFronteira = 1;
var closedNodes = []
async function teste() {
    while (true) {
        let lower = openNodes.reduce((prev, curr) => prev.final < curr.final ? prev : curr)
        closedNodes.push(lower);
        openNodes = openNodes.filter(i => i != lower);

        console.log(table(lower.puzzle.matrix))
        console.log(lower.final);

        if (lower.heuristic == 0) {
            console.log('fim')
            console.log({ closed: closedNodes.length, open: openNodes.length })
            console.log(table(lower.puzzle.matrix))
            console.log(lower)
            console.log(maiorFronteira)
            return;
        }
        console.log(lower.heuristic)

        let puzzles = lower.puzzle.getAllPossibleMatrixes();
        for (let m of puzzles) {
            if (closedNodes.filter(o => isEqual(o.puzzle.matrix, m.matrix)).length == 0) {
                let obj = { puzzle: m, heuristic: heuristic(m), parent: lower };
                obj.pathSize = getPathSize(obj);
                obj.final = obj.pathSize + obj.heuristic;
                openNodes.push(obj)
            }
        }
        maiorFronteira = Math.max(openNodes.length, maiorFronteira);
    }
}
function getPathSize(obj) {
    let tamanhoCaminho = 0;
    let parent = obj.parent
    while (parent) {
        tamanhoCaminho++;
        parent = parent.parent;
    }
    return tamanhoCaminho;

}
teste();