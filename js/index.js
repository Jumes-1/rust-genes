function mode(array) {
	return Object.entries(
		array.reduce((previous, current) => {
			if (previous[current] === undefined) previous[current] = 1;
			else previous[current]++;
			return previous;
		}, {})).reduce((previous, current) => (current[1] >= previous[1] ? current : previous))[0];
}

function unique(array) {
	return !array.some((val, i) => array.indexOf(val) !== i);
}

function arrayHeatmap(plant) {
	var simplified = plant.join('')
	return heatmap(simplified)
}

function heatmap(plant) {
	return {
		x: howManyInString("X", plant),
		w: howManyInString("W", plant),
		h: howManyInString("H", plant),
		y: howManyInString("Y", plant),
		g: howManyInString("G", plant),
	}
}

function calc(array) {
	var actual = [];

	for (let i = 0; i < 6; i++) {
		var mostCommonCharacter = mode([array[0][i], array[1][i], array[2][i], array[3][i]]);
		actual.push(mostCommonCharacter)
	}

	return actual
}

function actualCalc(array) {
	let actual = [];
	
	for (let i = 0; i < 6; i++) {
		// X X X X
		// Y Y G G
		let characterHeatmap = arrayHeatmap([array[0][i], array[1][i], array[2][i], array[3][i]]);

		// if (characterHeatmap.g == 4) {
		// 	actual.push("G")
		// 	continue
		// }

		// if (characterHeatmap.y == 2) {
		// 	actual.push("Y")
		// 	continue
		// }

		// return null

		if (characterHeatmap.x > 1) return null
		if (characterHeatmap.w > 1) return null
		if (characterHeatmap.h >= 2) return null
		
		let goodGenes = characterHeatmap.g + characterHeatmap.y

		if (goodGenes <= 1) return null
		
		if (characterHeatmap.y == 2 && characterHeatmap.g == 2) {
			actual.push("?")
			continue
		}

		if (characterHeatmap.y > 1) {
			actual.push("Y")
			continue
		}
		if (characterHeatmap.g > 1) {
			actual.push("G")
			continue
		}

		//actual.push(mostCommonCharacter)
	}

	if (actual.length < 6) return null

	return actual;
}

function nullableCalc(array) {
	let actual = [];
	
	for (let i = 0; i < 6; i++) {
		// X X X X
		// Y Y G G
		let characterHeatmap = arrayHeatmap([array[0][i], array[1][i], array[2][i], array[3][i]]);

		// if (characterHeatmap.g == 2) {
		// 	actual.push("G")
		// 	continue
		// }

		// if (characterHeatmap.y == 2) {
		// 	actual.push("Y")
		// 	continue
		// }

		// if (characterHeatmap.h == 2) {
		// 	actual.push("H")
		// 	continue
		// }

		// return null

		if (characterHeatmap.x > 1) return null
		if (characterHeatmap.w > 1) return null
		if (characterHeatmap.h > 2) return null
		
		let goodGenes = characterHeatmap.g + characterHeatmap.y

		if (goodGenes <= 1) return null
		
		if (characterHeatmap.y == 2 && characterHeatmap.g == 2) {
			actual.push("?")
			continue
		}

		if (characterHeatmap.y == 2 && characterHeatmap.h == 2) {
			actual.push("?")
			continue
		}

		if (characterHeatmap.g == 2 && characterHeatmap.h == 2) {
			actual.push("?")
			continue
		}

		if (characterHeatmap.y > 1) {
			actual.push("Y")
			continue
		}
		if (characterHeatmap.g > 1) {
			actual.push("G")
			continue
		}

		//actual.push(mostCommonCharacter)
	}

	if (actual.length < 6) return null

	return actual;
}

function howManyInString(char, string) {
	return string.split(char).length - 1
}

var app = new Vue({
	el: '#app',
	data: {
		message: 'Hello Vue!',
		plants: [
			[ "X", "X", "X", "X", "X", "X" ], 
			[ "X", "X", "X", "X", "X", "X" ], 
			[ "X", "X", "X", "X", "X", "X" ], 
			[ "X", "X", "X", "X", "X", "X" ]
		],
		input: "",
		selectionModel: false,
		outputResults: [],
		outputPositions: [],
		selected: [],
		availablePlants: [
			"WGGGHX",
			"HGHGGW",
			"WGYYHX", 
			"YYHWGH",
			"WYYXYY",
			"XYGXGY",
			"YYYYGW",
			"WXHYGY",
			"GYYYXY",
			"GYGHGX",
			"HGYHYX",
			"WYYHGW",
			"GGHWGX",
			"YYYWHX",
			"XHYWGG",
			"GYGWWY",
			"YGHXGY",
			"WYGXGG",
			"HYYYHH",
			"GYGYGY",
			"GYGYGG",
			"YGHYGY",
		]
	},
	methods: {

		addPlant: function (event) {
			var makeCopyOfPlant = this.plants[0].slice(0)
			this.availablePlants.push(makeCopyOfPlant)
		},
		calcBestCombination: function (event) {
			if (this.availablePlants.length < 3) {
				return
			}

			// Loop though all combinations of available plants 

			// 4 plant types

			// order of plant types doesn't matter, two of the same plant type should not be used.
			
			var timeStarted = Math.round((new Date()).getTime() / 1000);
			
			var output = [];
			var results = [];
			var positions = [];

			for (firstElement of this.availablePlants) {
				for (secondElement of this.availablePlants) {
					if (firstElement == secondElement) continue

					for (thirdElement of this.availablePlants) {
						if ([firstElement, secondElement].includes(thirdElement)) continue

						for (fourthElement of this.availablePlants) {
							if ([firstElement, secondElement, thirdElement].includes(fourthElement)) continue

							var elements = [firstElement, secondElement, thirdElement, fourthElement]

							let resultOutput = calc(elements)
							let nullableOutput = nullableCalc(elements)

							let simplified = resultOutput.join('')

							if (nullableOutput == null ||
								resultOutput.includes("X") || 
								resultOutput.includes("W") || 
								howManyInString("H", simplified) > 1 || // Hiding with too many H values
								howManyInString("Y", simplified) != 4 || // Hiding with too many Y values
								howManyInString("G", simplified) != 2 || // Hiding with too many G values
								//resultOutput.includes("H") || 
								results.includes(simplified)) {
								continue
							}

							let simplifiedNullable = nullableOutput.join('')

							if (results.includes(simplifiedNullable)) continue

							console.log(simplified + " " + nullableOutput.join(''))
							console.log("Selected")

							output.push(elements)
							results.push(simplifiedNullable)

							let indexes = [
								this.availablePlants.findIndex((value) => value == firstElement),
								this.availablePlants.findIndex((value) => value == secondElement),
								this.availablePlants.findIndex((value) => value == thirdElement),
								this.availablePlants.findIndex((value) => value == fourthElement),
							]

							this.selected = indexes
							positions.push(indexes)
						}
					}
				}
			}

			console.log(output);
			console.log(results);
			console.log(positions);

			this.outputResults = results
			this.outputPositions = positions
			
			this.selectionModel = true

			var timeEnded = Math.round((new Date()).getTime() / 1000);
			var diff = timeEnded - timeStarted

			console.log(timeStarted + " " + timeEnded + " = " + diff)

			// Show options to user
		},
		selectResult: function (index) {
			console.log("Selected " + index)
			console.log(this.outputResults[index])
			console.log(this.outputPositions[index])

			this.selected = this.outputPositions[index]
			this.close()
		},
		close: function () {
			this.selectionModel = false
		}
	},
	computed: {
		output: function () {
			var actual = [];

			for (let i = 0; i < 6; i++) {
				var mostCommonCharacter = mode([this.plants[0][i], this.plants[1][i], this.plants[2][i], this.plants[3][i]]);
				actual.push(mostCommonCharacter)
			}

			console.log(actual);

			return actual
		}
	}	
})