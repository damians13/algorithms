class MinHeap {
	constructor(lessThan = (a, b) => a < b, getValue = e => e) {
		// Using an array to represent a complete binary tree
		this.array = []
		this.lessThan = lessThan
		this.getValue = getValue
	}

	heapifyDown(i) {
		if (this.hasRightChild(i)) {
			// Has two child nodes
			if (this.lessThan(this.getRightChildValue(i), this.getLeftChildValue(i)) && this.lessThan(this.getRightChildValue(i), this.getValue(this.array[i]))) {
				this.swap(i, this.getRightChildIndex(i))
				this.heapifyDown(this.getRightChildIndex(i))
			} else if (this.lessThan(this.getLeftChildValue(i), this.getValue(this.array[i]))) {
				this.swap(i, this.getLeftChildIndex(i))
				this.heapifyDown(this.getLeftChildIndex(i))
			}
		} else if (this.hasLeftChild(i)) {
			// Has one child node
			if (this.lessThan(this.getLeftChildValue(i), this.getValue(this.array[i]))) {
				this.swap(i, this.getLeftChildIndex(i))
				this.heapifyDown(this.getLeftChildIndex(i))
			}
		}
		// Else: has no child nodes, do nothing
	}

	heapifyUp(i) {
		if (this.hasParent(i) && this.lessThan(this.getValue(this.array[i]), this.getParentValue(i))) {
			this.swap(i, this.getParentIndex(i))
			this.heapifyUp(this.getParentIndex(i))
		}
	}

	hasParent(i) {
		return i > 0 && i < this.array.length
	}

	getParentIndex(i) {
		if (this.hasParent(i)) {
			return Math.floor((i - 1) / 2)
		} else {
			return -1
		}
	}

	getParentValue(i) {
		if (this.hasParent(i)) {
			return this.getValue(this.array[this.getParentIndex(i)])
		} else {
			throw new Error(`Tried to get parent value for index ${i}, but no parent exists`)
		}
	}

	hasLeftChild(i) {
		return this.getLeftChildIndex(i) >= 0
	}

	hasRightChild(i) {
		return this.getRightChildIndex(i) >= 0
	}

	getLeftChildIndex(i) {
		let leftIndex = 2 * (i + 1) - 1
		if (leftIndex < this.array.length) {
			return leftIndex
		} else {
			return -1
		}
	}

	getLeftChildValue(i) {
		if (this.hasLeftChild(i)) {
			return this.getValue(this.array[this.getLeftChildIndex(i)])
		} else {
			throw new Error(`Tried to get left child value for index ${i}, but no left child exists`)
		}
	}

	getRightChildIndex(i) {
		let rightIndex = 2 * (i + 1)
		if (rightIndex < this.array.length) {
			return rightIndex
		} else {
			return -1
		}
	}

	getRightChildValue(i) {
		if (this.hasRightChild(i)) {
			return this.getValue(this.array[this.getRightChildIndex(i)])
		} else {
			throw new Error(`Tried to get right child value for index ${i}, but no right child exists`)
		}
	}

	insert(e) {
		this.array.push(e)
		this.heapifyUp(this.array.length - 1)
	}

	removeMin() {
		this.swap(0, this.array.length - 1)
		let min = this.array.pop()
		this.heapifyDown(0)
		return min
	}

	swap(i, j) {
		let temp = this.array[i]
		this.array[i] = this.array[j]
		this.array[j] = temp
	}
}

export default MinHeap
