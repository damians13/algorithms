import { BFSStateObject, generateAdjacencyLists, generateConnectedGraph } from "../pages/BFS"

const numIterations = 500 // Large number of iterations to ensure functions with random elements behave properly

test("generateConnectedGraph(1)", () => {
	for (let i = 0; i < numIterations; i++) {
		let [vertices, edges] = generateConnectedGraph(1)

		expect(vertices.length).toBe(1)
		expect(edges.length).toBe(0)
	}
})

test("generateConnectedGraph(2)", () => {
	for (let i = 0; i < numIterations; i++) {
		let [vertices, edges] = generateConnectedGraph(2)

		expect(vertices.length).toBe(2)
		expect(edges.length).toBe(1)
	}
})

test("generateConnectedGraph(5)", () => {
	for (let i = 0; i < numIterations; i++) {
		let [vertices, edges] = generateConnectedGraph(5)

		expect(vertices.length).toBe(5)
		expect(edges.length).toBeLessThanOrEqual(20) // A complete graph with n vertices can have n(n-1) edges max
	}
})

test("BFS adjacency lists on complete graph with n=3", () => {
	let adj = generateAdjacencyLists(
		[1, 2, 3],
		[
			{ from: 1, to: 2 },
			{ from: 1, to: 3 },
			{ from: 2, to: 3 },
		]
	)

	expect(adj[0]).toStrictEqual([2, 3])
	expect(adj[1]).toStrictEqual([1, 3])
	expect(adj[2]).toStrictEqual([1, 2])
})

test("BFS adjacency lists on incomplete graph with n=5", () => {
	let adj = generateAdjacencyLists(
		[1, 2, 3, 4, 5],
		[
			{ from: 1, to: 2 },
			{ from: 1, to: 4 },
			{ from: 2, to: 3 },
			{ from: 2, to: 4 },
			{ from: 4, to: 5 },
		]
	)

	expect(adj[0]).toStrictEqual([2, 4])
	expect(adj[1]).toStrictEqual([1, 3, 4])
	expect(adj[2]).toStrictEqual([2])
	expect(adj[3]).toStrictEqual([1, 2, 5])
	expect(adj[4]).toStrictEqual([4])
})

test("BFSStateObject constructor with no vertices", () => {
	for (let i = 0; i < numIterations; i++) {
		let obj = new BFSStateObject()

		expect(obj.vertices.length).toBeGreaterThanOrEqual(4)
		expect(obj.vertices.length).toBeLessThanOrEqual(9)
	}
})
