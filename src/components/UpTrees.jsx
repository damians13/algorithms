/**
 * Implementation of disjoint sets using uptrees with path compression
 * on find operations and smart unions by size
 */
class UpTrees {
	constructor() {
		this.forest = new Map()
	}

	add(e) {
		this.forest.set(e, -1)
	}

	union(a, b) {
		let rootA = this.find(a)
		let rootB = this.find(b)

		if (rootA === rootB) {
			return
		}

		let sizeA = this.forest.get(rootA)
		let sizeB = this.forest.get(rootB)

		if (sizeB < sizeA) {
			this.forest.set(rootA, rootB)
			this.forest.set(rootB, sizeA + sizeB)
		} else {
			this.forest.set(rootB, rootA)
			this.forest.set(rootA, sizeA + sizeB)
		}
	}

	find(e) {
		let value = this.forest.get(e)
		while (value >= 0) {
			let newE = value
			let newValue = this.forest.get(newE)
			if (newValue > 0) {
				this.forest.set(e, newValue) // Path compression
			}
			e = newE
			value = this.forest.get(e)
		}
		return e
	}
}

export default UpTrees
