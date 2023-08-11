import { generateAdjacencyLists, generateConnectedGraph } from "../components/Graph"

const numIterations = 500

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
	let edgeMap = new Map([
		[JSON.stringify({ from: 1, to: 2 }), false],
		[JSON.stringify({ from: 1, to: 3 }), false],
		[JSON.stringify({ from: 2, to: 3 }), false],
	])
	let adj = generateAdjacencyLists(edgeMap)

	expect(adj[1]).toStrictEqual([2, 3])
	expect(adj[2]).toStrictEqual([1, 3])
	expect(adj[3]).toStrictEqual([1, 2])
})

test("BFS adjacency lists on incomplete graph with n=5", () => {
	let edgeMap = new Map([
		[JSON.stringify({ from: 1, to: 2 }), false],
		[JSON.stringify({ from: 1, to: 4 }), false],
		[JSON.stringify({ from: 2, to: 3 }), false],
		[JSON.stringify({ from: 2, to: 4 }), false],
		[JSON.stringify({ from: 4, to: 5 }), false],
	])
	let adj = generateAdjacencyLists(edgeMap)

	expect(adj[1]).toStrictEqual([2, 4])
	expect(adj[2]).toStrictEqual([1, 3, 4])
	expect(adj[3]).toStrictEqual([2])
	expect(adj[4]).toStrictEqual([1, 2, 5])
	expect(adj[5]).toStrictEqual([4])
})
