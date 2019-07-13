class Puzzle {
	constructor(matrix) {
		this.matrix = matrix
	}

	getNumberRowAndColumn(input) {
		for (let [row, arrays] of this.matrix.entries()) {
			for (let [column, number] of arrays.entries()) {
				if (number == input) return { row, column }
			}
		}
		return null
	}

	openChildren() {
		let zeroPosition = this.getNumberRowAndColumn(0)
		let matrixes = [this.moveLeft(zeroPosition), this.moveRight(zeroPosition), this.moveDown(zeroPosition), this.moveUp(zeroPosition)]
		return matrixes.filter(o => !!o)
	}

	moveLeft(position) {
		if (position.column == 0) {
			return null
		}
		return this.move(position, { row: position.row, column: position.column - 1 })
	}

	moveRight(position) {
		if (position.column == 2) {
			return null
		}
		return this.move(position, { row: position.row, column: position.column + 1 })
	}
	moveUp(position) {
		if (position.row == 0) {
			return null
		}
		return this.move(position, { row: position.row - 1, column: position.column })
	}
	moveDown(position) {
		if (position.row == 2) {
			return null
		}
		return this.move(position, { row: position.row + 1, column: position.column })
	}

	cloneMatrix() {
		return JSON.parse(JSON.stringify(this.matrix))
	}

	move(oldPosition, newPosition) {
		let matrix = this.cloneMatrix()
		let number = matrix[oldPosition.row][oldPosition.column]
		let temp = matrix[newPosition.row][newPosition.column]
		matrix[newPosition.row][newPosition.column] = number
		matrix[oldPosition.row][oldPosition.column] = temp
		return new Puzzle(matrix)
	}
	getMatrix() {
		return this.matrix
	}
	getPosition(input) {
		for (let [x, arrays] of this.matrix.entries()) {
			for (let [y, number] of arrays.entries()) {
				if (number == input) return { x, y }
			}
		}
		return null
	}
}

// Helpers.js

function isEqual(matrix, otherMatrix) {
	if (matrix.length != otherMatrix.length) {
		return false
	}

	for (let i = 0; i < matrix.length; i++) {
		if (matrix[i].length != otherMatrix[i].length) {
			return false
		}

		for (let j = 0; j < matrix[i].length; j++) {
			if (matrix[i][j] != otherMatrix[i][j]) {
				return false
			}
		}
	}

	return true
}

// Matrixes
const solvedPuzzle = new Puzzle([[1, 2, 3], [4, 5, 6], [7, 8, 0]])

let wrongPuzzles = [new Puzzle([[8, 3, 6], [1, 0, 2], [4, 7, 5]]), new Puzzle([[0, 8, 7], [6, 5, 4], [3, 2, 1]]), new Puzzle([[0, 1, 2], [5, 6, 3], [4, 7, 8]])]

const toSolvePuzzle = wrongPuzzles[0]

// Método principal
function run(heuristic) {
	// Fronteira ordenada
	let borderland = [
		{
			puzzle: toSolvePuzzle,
			heuristic: heuristic(toSolvePuzzle),
			totalCost: getTotalCost(toSolvePuzzle),
			parent: null
		}
	]
	let maiorFronteira = 1
	let closedNodes = []
	while (true) {
		// Retorna o nodo de menor custo + heuristica, ou seja, o primeiro, e o remove da fronteira
		let lower = borderland.shift()

		// Adiciona nodo na lista de nodos fechados
		closedNodes.push(lower)

		// Se nodo for uma folha
		if (lower.heuristic == 0) {
			print('fim')
			print({ closed: closedNodes.length, open: borderland.length })
			print({ lower })
			print({ maiorFronteira })
			return
		}

		// Abre os filhos deste nodo
		let puzzles = lower.puzzle.openChildren()
		for (let m of puzzles) {
			// É verdadeiro caso nodo filho já exista na lista de nodos fechados
			let existsOnClosed = closedNodes.filter(o => isEqual(o.puzzle.matrix, m.matrix)).length != 0

			// É verdadeiro caso nodo filho já exista na fronteira
			let existsOnBorderland = borderland.filter(o => isEqual(o.puzzle.matrix, m.matrix)).length != 0

			//Se não existir nem na fronteira nem em nodos fechados, adiciona à fronteira
			if (!existsOnBorderland && !existsOnClosed) {
				let node = { puzzle: m, heuristic: heuristic(m), parent: lower }
				node.totalCost = getTotalCost(node)

				// Algoritmo para colocar o nodo de forma ordenada na fronteira
				for (let i = 0; i < borderland.length; i++) {
					if (node.heuristic + node.totalCost <= borderland[i].heuristic + borderland[i].totalCost) {
						borderland.splice(i, 0, node)
						break
					}
					if (i == borderland.length - 1) {
						borderland.push(node)
						break
					}
				}
				if (borderland.length == 0) {
					borderland.push(node)
				}
			}
		}
		// Guarda valor da maior fronteira existente
		maiorFronteira = Math.max(borderland.length, maiorFronteira)
	}
}

// Retorna o custo total, basicamente contando os nodos pai até chegar no topo da árvore
function getTotalCost(obj) {
	let tamanhoCaminho = 0
	let parent = obj.parent
	while (parent) {
		tamanhoCaminho++
		parent = parent.parent
	}
	return tamanhoCaminho
}

// Distance to right place
function distanceToRightPlace(number, i, j) {
	let { x, y } = solvedPuzzle.getPosition(number)
	let distance = Math.abs(i - x) + Math.abs(j - y)
	if (!number) distance = 0
	return distance
}

function distanceToRightPlaceHeuristic(puzzle) {
	let sum = 0

	for (let [i, arrays] of puzzle.matrix.entries()) {
		for (let [j, number] of arrays.entries()) {
			sum += distanceToRightPlace(number, i, j)
		}
	}
	return sum
}

// Quantity at wrong place
function isAtRightPlace(number, i, j) {
	let { x, y } = solvedPuzzle.getPosition(number)
	return x == i && j == y
}

function quantityAtWrongPlaceHeuristic(puzzle) {
	let sum = 0

	for (let [i, arrays] of puzzle.matrix.entries()) {
		for (let [j, number] of arrays.entries()) {
			sum += isAtRightPlace(number, i, j) ? 0 : 1
		}
	}
	return sum
}

// None (Custo uniforme)

function noneHeuristic({ matrix }) {
	if (isEqual(matrix, solvedPuzzle.matrix)) {
		return 0
	}
	return 1
}

let print
function start() {
	try {
		// Html
		let code = document.getElementById('code')

		print = text => {
			if (!document) {
				console.log(text)
				return
			}
			if (typeof text == 'object') {
				text = JSON.stringify(text, null, 2)
			}
			code.innerText += text + '\n'
		}

		document.getElementById('h1').addEventListener('click', () => run(distanceToRightPlaceHeuristic))
		document.getElementById('h2').addEventListener('click', () => run(quantityAtWrongPlaceHeuristic))
		document.getElementById('none').addEventListener('click', () => run(noneHeuristic))
	} catch (error) {
		// Node

		print = text => console.log(text)

		const readline = require('readline')

		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		})

		rl.question('Run which heuristic? \n(1) Distancia até o lugar certo \n(2) Quantidade no lugar errado\n(3) Custo uniforme\n', answer => {
			rl.close()
			switch (answer) {
				case '1':
					return run(distanceToRightPlaceHeuristic)
				case '2':
					return run(quantityAtWrongPlaceHeuristic)
				case '3':
					return run(noneHeuristic)
			}
		})
	}
}
start()
