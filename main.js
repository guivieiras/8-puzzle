export default class Puzzle {
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
