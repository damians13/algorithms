import { PrimStateObject } from "../pages/Prim"

test("step through algorithm execution", () => {
	let edgeMap = new Map([
		[JSON.stringify({ from: 1, to: 2, weight: 13 }), false],
		[JSON.stringify({ from: 1, to: 5, weight: 2 }), false],
		[JSON.stringify({ from: 2, to: 3, weight: 6 }), false],
		[JSON.stringify({ from: 2, to: 5, weight: 3 }), false],
		[JSON.stringify({ from: 3, to: 4, weight: 0 }), false],
		[JSON.stringify({ from: 4, to: 5, weight: 9 }), false],
	])
	let obj = new PrimStateObject([1, 2, 3, 4, 5], edgeMap)
	obj.edgeQueue.insert({ from: null, to: 1, weight: 0 }) // Start from 1

	obj = obj.step()
	expect(obj.visited).toStrictEqual([1])
	expect(obj.edgeQueue.array).toStrictEqual([
		{ from: 1, to: 5, weight: 2 },
		{ from: 1, to: 2, weight: 13 },
	])
	expect(obj.mostRecentEdge).toStrictEqual({ from: null, to: 1, weight: 0 })

	obj = obj.step()
	expect(obj.visited).toStrictEqual([1, 5])
	expect(obj.edgeQueue.array).toStrictEqual([
		{ from: 1, to: 5, weight: 2 },
		{ from: 4, to: 5, weight: 9 },
		{ from: 2, to: 5, weight: 3 },
		{ from: 1, to: 2, weight: 13 },
	])
	expect(obj.mostRecentEdge).toStrictEqual({ from: 1, to: 5, weight: 2 })

	obj = obj.step()
	expect(obj.visited).toStrictEqual([1, 5, 2])
	expect(obj.edgeQueue.array).toStrictEqual([
		{ from: 2, to: 5, weight: 3 },
		{ from: 2, to: 3, weight: 6 },
		{ from: 1, to: 2, weight: 13 },
		{ from: 1, to: 2, weight: 13 },
		{ from: 4, to: 5, weight: 9 },
	])
	expect(obj.mostRecentEdge).toStrictEqual({ from: 2, to: 5, weight: 3 })

	obj = obj.step()
	expect(obj.visited).toStrictEqual([1, 5, 2, 3])
	expect(obj.edgeQueue.array).toStrictEqual([
		{ from: 3, to: 4, weight: 0 },
		{ from: 2, to: 3, weight: 6 },
		{ from: 1, to: 2, weight: 13 },
		{ from: 1, to: 2, weight: 13 },
		{ from: 4, to: 5, weight: 9 },
	])
	expect(obj.mostRecentEdge).toStrictEqual({ from: 2, to: 3, weight: 6 })

	obj = obj.step()
	expect(obj.visited).toStrictEqual([1, 5, 2, 3, 4])
	expect(obj.edgeQueue.array).toStrictEqual([
		{ from: 3, to: 4, weight: 0 },
		{ from: 2, to: 3, weight: 6 },
		{ from: 4, to: 5, weight: 9 },
		{ from: 1, to: 2, weight: 13 },
		{ from: 4, to: 5, weight: 9 },
		{ from: 1, to: 2, weight: 13 },
	])
	expect(obj.mostRecentEdge).toStrictEqual({ from: 3, to: 4, weight: 0 })
	expect(obj.finished).toBe(false)

	obj = obj.step()
	expect(obj.visited).toStrictEqual([1, 5, 2, 3, 4])
	expect(obj.edgeQueue.array).toEqual([])
	expect(obj.mostRecentEdge).toBe(null)
	expect(obj.finished).toBe(true)
})

test("step through simple algorithm execution starting 3", () => {
	let edgeMap = new Map([
		[JSON.stringify({ from: 1, to: 2, weight: 13 }), false],
		[JSON.stringify({ from: 2, to: 3, weight: 6 }), false],
	])
	let obj = new PrimStateObject([1, 2, 3], edgeMap)
	obj.edgeQueue.insert({ from: null, to: 3, weight: 0 })

	obj = obj.step()
	expect(obj.visited).toStrictEqual([3])
	expect(obj.edgeQueue.array).toStrictEqual([{ from: 2, to: 3, weight: 6 }])
	expect(obj.mostRecentEdge).toStrictEqual({ from: null, to: 3, weight: 0 })

	obj = obj.step()
	expect(obj.visited).toStrictEqual([3, 2])
	expect(obj.edgeQueue.array).toStrictEqual([
		{ from: 2, to: 3, weight: 6 },
		{ from: 1, to: 2, weight: 13 },
	])
	expect(obj.mostRecentEdge).toStrictEqual({ from: 2, to: 3, weight: 6 })

	obj = obj.step()
	expect(obj.visited).toStrictEqual([3, 2, 1])
	expect(obj.edgeQueue.array).toStrictEqual([{ from: 1, to: 2, weight: 13 }])
	expect(obj.mostRecentEdge).toStrictEqual({ from: 1, to: 2, weight: 13 })
	expect(obj.finished).toBe(false)

	obj = obj.step()
	expect(obj.visited).toStrictEqual([3, 2, 1])
	expect(obj.edgeQueue.array).toEqual([])
	expect(obj.mostRecentEdge).toStrictEqual(null)
	expect(obj.finished).toBe(true)
})
