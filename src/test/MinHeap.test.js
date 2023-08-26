import MinHeap from "../components/MinHeap"

test("MinHeap swap", () => {
	let heap = new MinHeap()
	heap.array = [7, 3]
	heap.swap(0, 1)
	expect(heap.array).toStrictEqual([3, 7])
})

describe("MinHeap helper functions", () => {
	let heap
	beforeEach(() => {
		heap = new MinHeap()
		heap.array = [5, 6, 7, 18, 19, 8]
	})

	test("hasParent", () => {
		expect(heap.hasParent(0)).toBe(false)
		expect(heap.hasParent(1)).toBe(true)
		expect(heap.hasParent(2)).toBe(true)
		expect(heap.hasParent(3)).toBe(true)
		expect(heap.hasParent(4)).toBe(true)
		expect(heap.hasParent(5)).toBe(true)
	})

	test("getParentIndex", () => {
		expect(heap.getParentIndex(0)).toBe(-1)
		expect(heap.getParentIndex(1)).toBe(0)
		expect(heap.getParentIndex(2)).toBe(0)
		expect(heap.getParentIndex(3)).toBe(1)
		expect(heap.getParentIndex(4)).toBe(1)
		expect(heap.getParentIndex(5)).toBe(2)
	})

	test("getParentValue", () => {
		try {
			heap.getParentValue(0)
			expect(true).toBe(false)
		} catch (e) {
			expect(e.message).toBe("Tried to get parent value for index 0, but no parent exists")
		}
		expect(heap.getParentValue(1)).toBe(5)
		expect(heap.getParentValue(2)).toBe(5)
		expect(heap.getParentValue(3)).toBe(6)
		expect(heap.getParentValue(4)).toBe(6)
		expect(heap.getParentValue(5)).toBe(7)
	})

	test("getLeftChildIndex", () => {
		expect(heap.getLeftChildIndex(0)).toBe(1)
		expect(heap.getLeftChildIndex(1)).toBe(3)
		expect(heap.getLeftChildIndex(2)).toBe(5)
		expect(heap.getLeftChildIndex(3)).toBe(-1)
	})

	test("getLeftChildValue", () => {
		expect(heap.getLeftChildValue(0)).toBe(6)
		expect(heap.getLeftChildValue(1)).toBe(18)
		expect(heap.getLeftChildValue(2)).toBe(8)
		try {
			heap.getLeftChildValue(3)
			expect(true).toBe(false)
		} catch (e) {
			expect(e.message).toBe("Tried to get left child value for index 3, but no left child exists")
		}
	})

	test("hasLeftChild", () => {
		expect(heap.hasLeftChild(0)).toBe(true)
		expect(heap.hasLeftChild(1)).toBe(true)
		expect(heap.hasLeftChild(2)).toBe(true)
		expect(heap.hasLeftChild(3)).toBe(false)
	})

	test("getRightChildIndex", () => {
		expect(heap.getRightChildIndex(0)).toBe(2)
		expect(heap.getRightChildIndex(1)).toBe(4)
		expect(heap.getRightChildIndex(2)).toBe(-1)
		expect(heap.getRightChildIndex(3)).toBe(-1)
	})

	test("getRightChildValue", () => {
		expect(heap.getRightChildValue(0)).toBe(7)
		expect(heap.getRightChildValue(1)).toBe(19)
		try {
			heap.getRightChildValue(2)
			expect(true).toBe(false)
		} catch (e) {
			expect(e.message).toBe("Tried to get right child value for index 2, but no right child exists")
		}
		try {
			heap.getRightChildValue(3)
			expect(true).toBe(false)
		} catch (e) {
			expect(e.message).toBe("Tried to get right child value for index 3, but no right child exists")
		}
	})

	test("hasRightChild", () => {
		expect(heap.hasRightChild(0)).toBe(true)
		expect(heap.hasRightChild(1)).toBe(true)
		expect(heap.hasRightChild(2)).toBe(false)
		expect(heap.hasRightChild(3)).toBe(false)
	})
})

test("MinHeap basic heapifyDown", () => {
	let heap = new MinHeap()
	heap.array = [3, 2]

	heap.heapifyDown(0)
	expect(heap.array).toStrictEqual([2, 3])
})

test("MinHeap heapifyDown after removal", () => {
	// Represents a min. heap immediately after removal
	let initialArray = [18, 5, 7, 6, 19, 8, 92]
	let heap = new MinHeap()
	heap.array = initialArray

	// Ensure no changes are made to the valid parts of the heap by repeated calls
	heap.heapifyDown(1)
	expect(heap.array).toStrictEqual(initialArray)
	heap.heapifyDown(2)
	expect(heap.array).toStrictEqual(initialArray)
	heap.heapifyDown(3)
	expect(heap.array).toStrictEqual(initialArray)
	heap.heapifyDown(4)
	expect(heap.array).toStrictEqual(initialArray)
	heap.heapifyDown(5)
	expect(heap.array).toStrictEqual(initialArray)
	heap.heapifyDown(6)
	expect(heap.array).toStrictEqual(initialArray)

	// Call heapifyDown on the first value in the heap, expecting changes
	heap.heapifyDown(0)
	expect(heap.array).toStrictEqual([5, 6, 7, 18, 19, 8, 92])
})

test("MinHeap basic heapifyUp", () => {
	let heap = new MinHeap()
	heap.array = [3, 2]

	heap.heapifyUp(1)
	expect(heap.array).toStrictEqual([2, 3])
})

test("MinHeap heapifyUp after insert", () => {
	// Represents a min. heap immediately after inserting a new min. value
	let initialArray = [5, 6, 7, 18, 19, 1]
	let heap = new MinHeap()
	heap.array = initialArray

	// Ensure no changes are made to the valid parts of the heap by repeated calls
	heap.heapifyUp(0)
	expect(heap.array).toStrictEqual(initialArray)
	heap.heapifyUp(1)
	expect(heap.array).toStrictEqual(initialArray)
	heap.heapifyUp(2)
	expect(heap.array).toStrictEqual(initialArray)
	heap.heapifyUp(3)
	expect(heap.array).toStrictEqual(initialArray)
	heap.heapifyUp(4)
	expect(heap.array).toStrictEqual(initialArray)

	// Call heapifyUp on the last value in the heap, expecting changes
	heap.heapifyUp(5)
	expect(heap.array).toStrictEqual([1, 6, 5, 18, 19, 7])
})

test("MinHeap insert", () => {
	let heap = new MinHeap()
	heap.insert(2)
	expect(heap.array).toStrictEqual([2])
	heap.insert(1)
	expect(heap.array).toStrictEqual([1, 2])
	heap.insert(3)
	expect(heap.array).toStrictEqual([1, 2, 3])
})

test("MinHeap removeMin", () => {
	let heap = new MinHeap()
	heap.array = [1, 2, 3]
	expect(heap.removeMin()).toBe(1)
	expect(heap.removeMin()).toBe(2)
	expect(heap.removeMin()).toBe(3)
})

describe("MinHeap functions on a simple object", () => {
	let heap
	beforeEach(() => {
		heap = new MinHeap(e => e.weight)
	})

	test("get child values", () => {
		heap.array = [
			{ weight: 2, value: "b" },
			{ weight: 3, value: "c" },
			{ weight: 1, value: "a" },
		]
		expect(heap.getRightChildValue(0)).toBe(1)
		expect(heap.getLeftChildValue(0)).toBe(3)
	})

	test("get parent", () => {
		heap.array = [
			{ weight: 2, value: "b" },
			{ weight: 3, value: "c" },
			{ weight: 1, value: "a" },
		]
		expect(heap.getParentValue(1)).toBe(2)
		expect(heap.getParentValue(2)).toBe(2)
	})

	test("has parent", () => {
		heap.array = [
			{ weight: 2, value: "b" },
			{ weight: 3, value: "c" },
			{ weight: 1, value: "a" },
		]
		expect(heap.hasParent(0)).toBe(false)
		expect(heap.hasParent(1)).toBe(true)
		expect(heap.hasParent(2)).toBe(true)
	})

	test("has child", () => {
		heap.array = [
			{ weight: 2, value: "b" },
			{ weight: 3, value: "c" },
			{ weight: 1, value: "a" },
		]
		// Left
		expect(heap.hasLeftChild(0)).toBe(true)
		expect(heap.hasLeftChild(1)).toBe(false)
		expect(heap.hasLeftChild(2)).toBe(false)
		// Right
		expect(heap.hasRightChild(0)).toBe(true)
		expect(heap.hasRightChild(1)).toBe(false)
		expect(heap.hasRightChild(2)).toBe(false)
		heap.array.pop()
		expect(heap.hasRightChild(0)).toBe(false)
		expect(heap.hasRightChild(1)).toBe(false)
		expect(heap.hasRightChild(2)).toBe(false)
	})

	test("swap", () => {
		heap.array = [
			{ weight: 2, value: "b" },
			{ weight: 3, value: "c" },
		]
		heap.swap(0, 1)
		expect(heap.array[0]).toStrictEqual({ weight: 3, value: "c" })
		expect(heap.array[1]).toStrictEqual({ weight: 2, value: "b" })
	})

	test("heapify up", () => {
		heap.array = [
			{ weight: 2, value: "b" },
			{ weight: 3, value: "c" },
			{ weight: 1, value: "a" },
		]

		heap.heapifyUp(2)
		expect(heap.array[0]).toStrictEqual({ weight: 1, value: "a" })
		expect(heap.array[1]).toStrictEqual({ weight: 3, value: "c" })
		expect(heap.array[2]).toStrictEqual({ weight: 2, value: "b" })
	})

	test("heapify down", () => {
		heap.array = [
			{ weight: 2, value: "b" },
			{ weight: 3, value: "c" },
			{ weight: 1, value: "a" },
		]
		heap.heapifyDown(0)
		expect(heap.array[0]).toStrictEqual({ weight: 1, value: "a" })
		expect(heap.array[1]).toStrictEqual({ weight: 3, value: "c" })
		expect(heap.array[2]).toStrictEqual({ weight: 2, value: "b" })
	})

	test("insert", () => {
		heap.insert({ weight: 2, value: "b" })
		heap.insert({ weight: 3, value: "c" })
		heap.insert({ weight: 1, value: "a" })

		expect(heap.array[0].weight).toBe(1)
		expect(heap.array[0].value).toBe("a")
		expect(heap.array[1].weight).toBe(3)
		expect(heap.array[1].value).toBe("c")
		expect(heap.array[2].weight).toBe(2)
		expect(heap.array[2].value).toBe("b")
	})
})
