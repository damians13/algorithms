import { KruskalStateObject } from "../pages/Kruskal"

let obj
beforeEach(() => {
	let edgeMap = new Map([
		[JSON.stringify({ from: 1, to: 2, weight: 13 }), false],
		[JSON.stringify({ from: 1, to: 5, weight: 2 }), false],
		[JSON.stringify({ from: 2, to: 3, weight: 6 }), false],
		[JSON.stringify({ from: 2, to: 5, weight: 3 }), false],
		[JSON.stringify({ from: 3, to: 4, weight: 0 }), false],
		[JSON.stringify({ from: 4, to: 5, weight: 9 }), false],
	])

	obj = new KruskalStateObject([1, 2, 3, 4, 5], edgeMap)
	obj.setup()
})

test("Kruskal state object setup", () => {
	expect(obj.disjointSets.find(1)).toBe(1)
	expect(obj.disjointSets.find(2)).toBe(2)
	expect(obj.disjointSets.find(3)).toBe(3)
	expect(obj.disjointSets.find(4)).toBe(4)
	expect(obj.disjointSets.find(5)).toBe(5)

	expect(obj.edgeQueue.array).toContainEqual({ from: 1, to: 2, weight: 13 })
	expect(obj.edgeQueue.array).toContainEqual({ from: 1, to: 5, weight: 2 })
	expect(obj.edgeQueue.array).toContainEqual({ from: 2, to: 3, weight: 6 })
	expect(obj.edgeQueue.array).toContainEqual({ from: 2, to: 5, weight: 3 })
	expect(obj.edgeQueue.array).toContainEqual({ from: 3, to: 4, weight: 0 })
	expect(obj.edgeQueue.array).toContainEqual({ from: 4, to: 5, weight: 9 })

	expect(obj.edgeQueue.removeMin()).toStrictEqual({ from: 3, to: 4, weight: 0 })
	expect(obj.edgeQueue.removeMin()).toStrictEqual({ from: 1, to: 5, weight: 2 })
	expect(obj.edgeQueue.removeMin()).toStrictEqual({ from: 2, to: 5, weight: 3 })
	expect(obj.edgeQueue.removeMin()).toStrictEqual({ from: 2, to: 3, weight: 6 })
	expect(obj.edgeQueue.removeMin()).toStrictEqual({ from: 4, to: 5, weight: 9 })
	expect(obj.edgeQueue.removeMin()).toStrictEqual({ from: 1, to: 2, weight: 13 })
})

test("step through Kruskal execution", () => {
	obj = obj.step()
	expect(obj.mostRecentEdge).toStrictEqual({ from: 3, to: 4, weight: 0 })

	obj = obj.step()
	expect(obj.mostRecentEdge).toStrictEqual({ from: 1, to: 5, weight: 2 })

	obj = obj.step()
	expect(obj.mostRecentEdge).toStrictEqual({ from: 2, to: 5, weight: 3 })

	obj = obj.step()
	expect(obj.mostRecentEdge).toStrictEqual({ from: 2, to: 3, weight: 6 })
	expect(obj.finished).toBe(false)

	obj = obj.step()
	expect(obj.mostRecentEdge).toBe(null)
	expect(obj.finished).toBe(true)
})
