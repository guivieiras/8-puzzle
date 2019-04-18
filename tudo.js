let heuristic = distanceToRightPlaceHeuristic
//Puzzle.js

class Puzzle {
    constructor(matrix) {
        this.matrix = matrix;
    }

    getNumberRowAndColumn(input) {
        for (var [row, arrays] of this.matrix.entries()) {
            for (var [column, number] of arrays.entries()) {
                if (number == input)
                    return { row, column }
            }
        }
        return null;
    }

    getAllPossibleMatrixes() {
        var zeroPosition = this.getNumberRowAndColumn(0);
        var matrixes = [
            this.moveLeft(zeroPosition),
            this.moveRight(zeroPosition),
            this.moveDown(zeroPosition),
            this.moveUp(zeroPosition)
        ]
        return matrixes.filter(o => !!o)
    }

    moveLeft(position) {
        if (position.column == 0) {
            return null;
        }
        return this.move(position, { row: position.row, column: position.column - 1 });
    }

    moveRight(position) {
        if (position.column == 2) {
            return null;
        }
        return this.move(position, { row: position.row, column: position.column + 1 });
    }
    moveUp(position) {
        if (position.row == 0) {
            return null;
        }
        return this.move(position, { row: position.row - 1, column: position.column });
    }
    moveDown(position) {
        if (position.row == 2) {
            return null;
        }
        return this.move(position, { row: position.row + 1, column: position.column });
    }

    cloneMatrix() {
        return JSON.parse(JSON.stringify(this.matrix));
    }

    move(oldPosition, newPosition) {
        let matrix = this.cloneMatrix();
        var number = matrix[oldPosition.row][oldPosition.column];
        var temp = matrix[newPosition.row][newPosition.column];
        matrix[newPosition.row][newPosition.column] = number;
        matrix[oldPosition.row][oldPosition.column] = temp;
        return new Puzzle(matrix);
    }
    getMatrix() {
        return this.matrix;
    }
    getPosition(input) {
        for (var [x, arrays] of this.matrix.entries()) {
            for (var [y, number] of arrays.entries()) {
                if (number == input)
                    return { x, y }
            }
        }
        return null;
    }
}

// Helpers.js

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }

function isEqual(value, other) {
    // Get the value type
    var type = Object.prototype.toString.call(value);

    // If the two objects are not the same type, return false
    if (type !== Object.prototype.toString.call(other)) return false;

    // If items are not an object or array, return false
    if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

    // Compare the length of the length of the two items
    var valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
    var otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
    if (valueLen !== otherLen) return false;

    // Compare two items
    var compare = function (item1, item2) {

        // Get the object type
        var itemType = Object.prototype.toString.call(item1);

        // If an object or array, compare recursively
        if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
            if (!isEqual(item1, item2)) return false;
        }

        // Otherwise, do a simple comparison
        else {

            // If the two items are not the same type, return false
            if (itemType !== Object.prototype.toString.call(item2)) return false;

            // Else if it's a function, convert to a string and compare
            // Otherwise, just compare
            if (itemType === '[object Function]') {
                if (item1.toString() !== item2.toString()) return false;
            } else {
                if (item1 !== item2) return false;
            }

        }
    };

    // Compare properties
    if (type === '[object Array]') {
        for (var i = 0; i < valueLen; i++) {
            if (compare(value[i], other[i]) === false) return false;
        }
    } else {
        for (var key in value) {
            if (value.hasOwnProperty(key)) {
                if (compare(value[key], other[key]) === false) return false;
            }
        }
    }

    // If nothing failed, return true
    return true;

};

// Matrixes.js

const solvedPuzzle = new Puzzle(
    [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 0]
    ]);


var wrongPuzzles = [new Puzzle(
    [
        [8, 3, 6],
        [1, 0, 2],
        [4, 7, 5]
    ]), new Puzzle([
        [0, 8, 7],
        [6, 5, 4],
        [3, 2, 1]
    ]), new Puzzle([
        [0, 1, 2],
        [5, 6, 3],
        [4, 7, 8]
    ])]

const toSolvePuzzle = wrongPuzzles[0];


// Run.js

var openNodes = [{ puzzle: toSolvePuzzle, heuristic: heuristic(toSolvePuzzle), parent: null }]
var maiorFronteira = 1;
var closedNodes = []
function teste() {
    while (true) {
        let lower = openNodes.reduce((prev, curr) => prev.final < curr.final ? prev : curr)
        closedNodes.push(lower);
        openNodes = openNodes.filter(i => i != lower);

        console.log(lower.final);

        if (lower.heuristic == 0) {
            console.log('fim')
            console.log({ closed: closedNodes.length, open: openNodes.length })
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

// Both

function bothHeuristic(puzzle) {
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

// Distance to right place

function distanceToRightPlace(number, i, j) {
    var { x, y } = solvedPuzzle.getPosition(number);
    var distance = Math.abs(i - x) + Math.abs(j - y);
    if (!number)
        distance = 0;
    return distance;
}

function distanceToRightPlaceHeuristic(puzzle) {
    var sum = 0;

    for (var [i, arrays] of puzzle.matrix.entries()) {
        for (var [j, number] of arrays.entries()) {
            sum += distanceToRightPlace(number, i, j);
        }
    }
    return sum;
}

// Quantity at wrong place

function isAtRightPlace(number, i, j) {
    var { x, y } = solvedPuzzle.getPosition(number);
    return x == i && j == y;
}

function quantityAtWrongPlaceHeuristic(puzzle) {
    var sum = 0;

    for (var [i, arrays] of puzzle.matrix.entries()) {
        for (var [j, number] of arrays.entries()) {
            sum += isAtRightPlace(number, i, j) ? 0 : 1;
        }
    }
    return sum;
}

// None

function noneHeuristic({ matrix }) {
    if (isEqual(matrix, solvedPuzzle.matrix)) {
        return 0;
    }
    return 1;
}


teste()