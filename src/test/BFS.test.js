import BFSStateObject, { generateConnectedGraph } from "../pages/BFS"

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
