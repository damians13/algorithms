import { generateWeightedAdjacencyLists, generateWeightedConnectedGraph } from "../components/Graph"
import MinHeap from "../components/MinHeap"

export class PrimStateObject {
	constructor(vertices, edges) {
		if (typeof vertices === "undefined" || typeof edges === "undefined") {
			let num = Math.floor(Math.random() * 3 + 7)
			let [V, E] = generateWeightedConnectedGraph(num)
			this.vertices = V
			this.edges = E
		} else {
			this.vertices = vertices
			this.edges = edges
		}

		// Populate adjacency lists
		this.adjacencies = generateWeightedAdjacencyLists(this.edges)

		this.visited = []
		this.edgeQueue = new MinHeap(e => e.weight)
		this.finished = false
	}

	step() {
		if (this.finished) {
			return this
		}

		// Clone this object
		let obj = new PrimStateObject(this.vertices, this.edges)
		obj.visited = this.visited
		obj.edgeQueue = this.edgeQueue

		// Get the next min-weighted edge that is not internal
		let edge = obj.edgeQueue.removeMin()
		while (edge && obj.visited.includes(edge.to) && obj.visited.includes(edge.from)) {
			edge = obj.edgeQueue.removeMin()
		}
		if (edge === undefined) {
			// No more edges in the queue, we have traversed the entire tree
			obj.finished = true
			return obj
		}

		// Determine which vertex is new and mark it as visited
		let vertex
		if (edge.from === null) {
			// First vertex case
			vertex = 1
		} else if (obj.visited.includes(edge.to)) {
			vertex = edge.from
		} else {
			vertex = edge.to
		}
		obj.visited.push(vertex)

		// Enqueue all incident edges
		let incidentEdges = obj.adjacencies[vertex]
		incidentEdges.forEach(e => {
			obj.edgeQueue.insert(e)
		})

		return obj
	}
}

function Prim() {
	return <p>Prim's algorithm</p>
}

export default Prim
