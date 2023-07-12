export class InsertionSortStateObject {
	constructor(array) {
		this.array = array

		this.sortedUpToIndex = 0
		this.gapIndex = 0
		this.isPickedUp = false
		this.wasPickedUp = false
		this.finished = false
	}

	/**
	 * Swaps the numbers at indices a and b, modifies this object
	 * @param {Number} a the first index
	 * @param {Number} b the second index
	 */
	swap(a, b) {
		let temp = this.array[a]
		this.array[a] = this.array[b]
		this.array[b] = temp
	}

	/**
	 * Clones this object and advances its state if not already finished
	 * @returns a close of the current state, advanced one step if possible
	 */
	step() {
		if (this.finished) {
			return this
		}

		// Clone the current state
		let newObj = new InsertionSortStateObject(this.array)
		newObj.sortedUpToIndex = this.sortedUpToIndex
		newObj.gapIndex = this.gapIndex
		newObj.isPickedUp = this.isPickedUp
		newObj.wasPickedUp = this.wasPickedUp

		if (!newObj.isPickedUp) {
			// Remember the fact that the element was not picked up for the animation
			newObj.wasPickedUp = false
			// Check if the element is in the correct position
			if (newObj.gapIndex === 0 || newObj.array[newObj.gapIndex] >= newObj.array[newObj.gapIndex - 1]) {
				// Prepare for next iteration (if not finished)
				newObj.sortedUpToIndex++
				newObj.gapIndex = newObj.sortedUpToIndex
				if (newObj.sortedUpToIndex === newObj.array.length) {
					newObj.finished = true
				}
			} else {
				// Element is not sorted, pick it up so we can move it and sort it on the next iteration
				newObj.isPickedUp = true
			}
		} else {
			// Remember the fact that the element was picked up for the animation
			newObj.wasPickedUp = true
			// Check if the element is in the correct position
			if (newObj.gapIndex === 0 || newObj.array[newObj.gapIndex] >= newObj.array[newObj.gapIndex - 1]) {
				// Put the element down
				newObj.isPickedUp = false
			} else {
				// Element is not sorted, swap it with the element to its left and decrement gapIndex
				newObj.swap(newObj.gapIndex, newObj.gapIndex - 1)
				newObj.gapIndex--
			}
		}
		return newObj
	}
}

function InsertionSort() {}

export default InsertionSort
