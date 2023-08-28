import { generateWeightedConnectedGraph } from "../components/Graph"
import MinHeap from "../components/MinHeap"
import UpTrees from "../components/UpTrees"

export class KruskalStateObject {
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

		this.disjointSets = new UpTrees()
		this.edgeQueue = new MinHeap(e => e.weight)
		this.mostRecentEdge = null
		this.finished = false
	}

	step() {
		//TODO
	}
}
