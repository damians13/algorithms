const MAX_NUM = 12

/**
 * This class represents the state of the BFS algorithm and supports the associated animations
 */
export class BFSStateObject {
	constructor(vertices, edges) {
		if (typeof vertices === "undefined" || typeof edges === "undefined") {
			let num = Math.floor(Math.random() * 5 + 5)
			const [vertices, edges] = generateConnectedGraph(num)
		}
		this.vertices = vertices
		this.edges = edges
	}
}

/**
 * This function generates a connected graph with num vertices.
 * Each vertex will be assigned a random degree between 1 and num-1.
 * @param {number} num the number of vertices to create in the graph
 * @returns {*} G represents the created graph, index 0 is the vertices array, index 1 is the edges array.
 * Each vertex is an integer, each edge is a object { from: int, to: int }.
 */
export function generateConnectedGraph(num) {
	let vertices = []
	let edges = []
	for (let i = 0; i < num; i++) {
		vertices.push(i)
		let desiredDegree = Math.floor(Math.random() * (num - 2) + 1)
		let numEdges = 0
		// Count the number of edges that already go to i
		edges.forEach(edge => {
			if (edge.to === i) {
				numEdges++
			}
		})
		// Add edges if current degree < desiredDegree
		while (numEdges < desiredDegree) {
			// Find a different vertex j which doesn't share an edge with i
			let j = Math.floor(Math.random() * num)
			while ({ from: i, to: j } in edges || j === i) {
				j = Math.floor(Math.random() * num)
			}
			edges.push({ from: i, to: j })
			numEdges++
		}
	}
	return [vertices, edges]
}

function BFS() {}

export default BFS
