import { generateAdjacencyLists, generateWeightedConnectedGraph } from "../components/Graph"

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
		this.adjacencies = generateAdjacencyLists(this.edges)
	}
}

function Prim() {
	return <p>Prim's algorithm</p>
}

export default Prim
