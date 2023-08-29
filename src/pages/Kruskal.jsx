import "../styles/Kruskal.css"
import { generateWeightedConnectedGraph } from "../components/Graph"
import MinHeap from "../components/MinHeap"
import UpTrees from "../components/UpTrees"
import Box from "../components/Box"
import { useState } from "react"

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
	}

	setup() {
		this.disjointSets = new UpTrees()
		this.edgeQueue = new MinHeap(e => e.weight)
		this.mostRecentEdge = null
		this.finished = false

		for (let edgeStr of this.edges.keys()) {
			let edge = JSON.parse(edgeStr)
			if (!this.disjointSets.has(edge.from)) {
				this.disjointSets.add(edge.from)
			}
			if (!this.disjointSets.has(edge.to)) {
				this.disjointSets.add(edge.to)
			}
			this.edgeQueue.insert(edge)
		}
	}

	step() {
		if (this.finished) {
			return this
		}

		// Clone the current object
		let obj = new KruskalStateObject(this.vertices, this.edges)
		obj.disjointSets = this.disjointSets
		obj.edgeQueue = this.edgeQueue
		obj.mostRecentEdge = null
		obj.finished = false

		// Get the lowest weighted edge that is not internal in any of the current trees
		// Ie. the endpoints of the edges are in different disjoint sets
		let edge = this.edgeQueue.removeMin()
		while (edge && this.disjointSets.find(edge.from) === this.disjointSets.find(edge.to)) {
			edge = this.edgeQueue.removeMin()
		}
		if (!edge) {
			// No more edges in the queue
			obj.finished = true
			return obj
		}

		// Add the new edge to the solution
		obj.mostRecentEdge = edge

		// Union the two disjoint sets that are joined by the edge
		obj.disjointSets.union(edge.from, edge.to)

		return obj
	}
}

function Kruskal() {
	const [obj, setObj] = useState(new KruskalStateObject())
	const [kruBoxRect, setKruBoxRect] = useState(null)
	const [animationPlaying, setAnimationPlaying] = useState(false)

	return (
		<div className="page">
			<div id="kru-box" className="fg-box">
				<p className="title-text">Kruskal's algorithm</p>
				<p className="title-description">minimum spanning tree of a weighted graph</p>
				<div id="kru-content">
					<div id="kru-boxes">
						<canvas id="kru-edge-canvas"></canvas>
						{(() => obj.vertices.map(vertex => <Box text={vertex + 1} id={"kru-b" + vertex} key={"kru-box" + vertex} />))()}
					</div>
					<div id="kru-buttons">
						<button className="button kru-button">GO</button>
						<button className="button kru-button">RANDOMIZE</button>
					</div>
					<div id="kru-right-hand-side">
						<div id="kru-edge-queue"></div>
						<div id="kru-disjoint-sets"></div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Kruskal
