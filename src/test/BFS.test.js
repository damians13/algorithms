import { BFSStateObject } from "../pages/BFS"

const numIterations = 500 // Large number of iterations to ensure functions with random elements behave properly

test("BFSStateObject constructor with no input", () => {
	for (let i = 0; i < numIterations; i++) {
		let obj = new BFSStateObject()

		expect(obj.vertices.length).toBeGreaterThanOrEqual(4)
		expect(obj.vertices.length).toBeLessThanOrEqual(9)

		obj.vertices.forEach(vertex => {
			expect(vertex).toBeGreaterThanOrEqual(0)
			expect(vertex).toBeLessThan(12)
		})
	}
})

test("Step through BFS execution", () => {
	let edgeSet = new Map([
		[JSON.stringify({ from: 1, to: 2 }), false],
		[JSON.stringify({ from: 1, to: 3 }), false],
		[JSON.stringify({ from: 2, to: 3 }), false],
		[JSON.stringify({ from: 2, to: 4 }), false],
		[JSON.stringify({ from: 3, to: 5 }), false],
	])
	let obj = new BFSStateObject([1, 2, 3, 4, 5], edgeSet)
	obj.queue.push(1) // Start from 1
	obj.enqueuedList.push(-1) // Signal that 1 is the start of the traversal

	obj = obj.step()
	expect(obj.queue).toStrictEqual([2, 3])
	expect(obj.visited).toStrictEqual([1])
	expect(obj.enqueuedList).toStrictEqual([1, 1])
	expect(obj.enqueuedBy).toBe(-1)

	obj = obj.step()
	expect(obj.queue).toStrictEqual([3, 1, 3, 4])
	expect(obj.visited).toStrictEqual([1, 2])
	expect(obj.enqueuedList).toStrictEqual([1, 2, 2, 2])
	expect(obj.enqueuedBy).toBe(1)

	obj = obj.step()
	expect(obj.queue).toStrictEqual([1, 3, 4, 1, 2, 5])
	expect(obj.visited).toStrictEqual([1, 2, 3])
	expect(obj.enqueuedList).toStrictEqual([2, 2, 2, 3, 3, 3])
	expect(obj.enqueuedBy).toBe(1)

	obj = obj.step()
	expect(obj.queue).toStrictEqual([1, 2, 5, 2])
	expect(obj.visited).toStrictEqual([1, 2, 3, 4])
	expect(obj.enqueuedList).toStrictEqual([3, 3, 3, 4])
	expect(obj.enqueuedBy).toBe(2)

	obj = obj.step()
	expect(obj.queue).toStrictEqual([2, 3])
	expect(obj.visited).toStrictEqual([1, 2, 3, 4, 5])
	expect(obj.enqueuedList).toStrictEqual([4, 5])
	expect(obj.enqueuedBy).toBe(3)
	expect(obj.finished).toBe(false)

	obj = obj.step()
	expect(obj.queue).toStrictEqual([])
	expect(obj.visited).toStrictEqual([1, 2, 3, 4, 5])
	expect(obj.enqueuedList).toStrictEqual([])
	expect(obj.finished).toBe(true)
})
