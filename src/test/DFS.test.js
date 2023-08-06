import { DFSStateObject } from "../pages/DFS"

const numIterations = 500 // Large number of iterations to ensure functions with random elements behave properly

test("DFSStateObject constructor with no input", () => {
	for (let i = 0; i < numIterations; i++) {
		let obj = new DFSStateObject()

		expect(obj.vertices.length).toBeGreaterThanOrEqual(4)
		expect(obj.vertices.length).toBeLessThanOrEqual(9)

		obj.vertices.forEach(vertex => {
			expect(vertex).toBeGreaterThanOrEqual(0)
			expect(vertex).toBeLessThan(12)
		})
	}
})

test("Step through DFS execution", () => {
	let edgeMap = new Map([
		[JSON.stringify({ from: 1, to: 2 }), false],
		[JSON.stringify({ from: 1, to: 3 }), false],
		[JSON.stringify({ from: 2, to: 3 }), false],
		[JSON.stringify({ from: 2, to: 4 }), false],
		[JSON.stringify({ from: 3, to: 5 }), false],
	])
	let obj = new DFSStateObject([1, 2, 3, 4, 5], edgeMap)
	obj.stack.push(1) // Start from 1
	obj.pushedList.push(-1) // Signal that 1 is the start of the traversal

	obj = obj.step()
	expect(obj.stack).toStrictEqual([2, 3])
	expect(obj.visited).toStrictEqual([1])
	expect(obj.pushedList).toStrictEqual([1, 1])
	expect(obj.pushedBy).toBe(-1)

	obj = obj.step()
	expect(obj.stack).toStrictEqual([2, 1, 2, 5])
	expect(obj.visited).toStrictEqual([1, 3])
	expect(obj.pushedList).toStrictEqual([1, 3, 3, 3])
	expect(obj.pushedBy).toBe(1)

	obj = obj.step()
	expect(obj.stack).toStrictEqual([2, 1, 2, 3])
	expect(obj.visited).toStrictEqual([1, 3, 5])
	expect(obj.pushedList).toStrictEqual([1, 3, 3, 5])
	expect(obj.pushedBy).toBe(3)

	obj = obj.step()
	expect(obj.stack).toStrictEqual([2, 1, 1, 3, 4])
	expect(obj.visited).toStrictEqual([1, 3, 5, 2])
	expect(obj.pushedList).toStrictEqual([1, 3, 2, 2, 2])
	expect(obj.pushedBy).toBe(3)

	obj = obj.step()
	expect(obj.stack).toStrictEqual([2, 1, 1, 3, 2])
	expect(obj.visited).toStrictEqual([1, 3, 5, 2, 4])
	expect(obj.pushedList).toStrictEqual([1, 3, 2, 2, 4])
	expect(obj.pushedBy).toBe(2)
	expect(obj.finished).toBe(false)

	obj = obj.step()
	expect(obj.stack).toStrictEqual([])
	expect(obj.visited).toStrictEqual([1, 3, 5, 2, 4])
	expect(obj.pushedList).toStrictEqual([])
	expect(obj.finished).toBe(true)
})
