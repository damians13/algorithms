import { BFSStateObject, generateAdjacencyLists, generateConnectedGraph } from "../pages/BFS"

const numIterations = 500 // Large number of iterations to ensure functions with random elements behave properly

test("generateConnectedGraph(1)", () => {
	for (let i = 0; i < numIterations; i++) {
		let [vertices, edges] = generateConnectedGraph(1)

		expect(vertices.length).toBe(1)
		expect(edges.size).toBe(0)
	}
})

test("generateConnectedGraph(12)", () => {
	for (let i = 0; i < numIterations; i++) {
		let [vertices, edges] = generateConnectedGraph(12)

		expect(vertices.length).toBe(12)
		expect(edges.size).toBeLessThanOrEqual(132) // A complete graph with n vertices can have n(n-1) edges max
	}
})

test("BFS adjacency lists on complete graph with n=3", () => {
	let edgeSet = new Set([JSON.stringify({ from: 1, to: 2 }), JSON.stringify({ from: 1, to: 3 }), JSON.stringify({ from: 2, to: 3 })])
	let adj = generateAdjacencyLists(edgeSet)

	expect(adj[1]).toStrictEqual([2, 3])
	expect(adj[2]).toStrictEqual([1, 3])
	expect(adj[3]).toStrictEqual([1, 2])
})

test("BFS adjacency lists on incomplete graph with n=5", () => {
	let edgeSet = new Set([
		JSON.stringify({ from: 1, to: 2 }),
		JSON.stringify({ from: 1, to: 4 }),
		JSON.stringify({ from: 2, to: 3 }),
		JSON.stringify({ from: 2, to: 4 }),
		JSON.stringify({ from: 4, to: 5 }),
	])
	let adj = generateAdjacencyLists(edgeSet)

	expect(adj[1]).toStrictEqual([2, 4])
	expect(adj[2]).toStrictEqual([1, 3, 4])
	expect(adj[3]).toStrictEqual([2])
	expect(adj[4]).toStrictEqual([1, 2, 5])
	expect(adj[5]).toStrictEqual([4])
})

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

test("generateConnectedGraph produced no duplicate edges", () => {
	for (let i = 0; i < numIterations; i++) {
		let [V, E] = generateConnectedGraph(12)
		for (let j = 0; j < E.length; j++) {
			let num = 0
			for (let k = j + 1; k < E.length; k++) {
				if ((E[j].to === E[k].to && E[j].from === E[k].from) || (E[j].to === E[k].from && E[j].from === E[k].to)) {
					num++
				}
			}
			try {
				expect(num).toBe(0)
			} catch {
				console.log(i)
				console.log(E)
				throw new Error(num)
			}
		}
	}
})

test("Step through BFS execution", () => {
	let edgeSet = new Set([
		JSON.stringify({ from: 1, to: 2 }),
		JSON.stringify({ from: 1, to: 3 }),
		JSON.stringify({ from: 2, to: 3 }),
		JSON.stringify({ from: 2, to: 4 }),
		JSON.stringify({ from: 3, to: 5 }),
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
