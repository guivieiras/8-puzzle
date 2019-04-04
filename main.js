var solvedMatrix = 
[
	[1,2,3],
	[4,5,6],
	[7,8,0]
]

var randomMatrix =  
[
	[8,3,6],
	[0,1,2],
	[4,7,5]
]

var randomMatrixx =  
[
	[0,8,7],
	[6,5,4],
	[3,2,1]
]


var sum = 0;
for (var [i, arrays] of randomMatrix.entries()){
	for (var [j, number] of arrays.entries()){
		var {distance, number} = distanceToRightPlace(number, i, j)
		console.log({distance, number})
		sum += distance;
	}
}
console.log(sum)

function distanceToRightPlace(number, i, j){
	var {row, column} = getLineAndRow(number);
	var distance = Math.abs(i - row) + Math.abs(j - column)
	return {distance, number};
}

function getLineAndRow(input){
	for (var [row, arrays] of solvedMatrix.entries()){
		for (var [column, number] of arrays.entries()){
			if (number == input)
				return {row, column }
		}
	}	
	return null;
}

