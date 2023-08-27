import "../styles/Prim.css"
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter"
import java from "react-syntax-highlighter/dist/cjs/languages/prism/java"
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism"
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
	SyntaxHighlighter.registerLanguage("java", java)

	function handleGoClick() {}
	function handleRandomizeClick() {}
	function generateAdjacencyListElements() {}

	return (
		<div className="page">
			<div id="prim-box" className="fg-box">
				<p className="title-text">Prim's algorithm</p>
				<p className="title-description">minimum spanning tree of a weighted graph</p>
				<div id="prim-content">
					<div id="prim-boxes">
						<canvas id="prim-edge-canvas"></canvas>
					</div>
					<div id="prim-buttons">
						<label htmlFor="prim-start-number">Start from</label>
						<input type="number" min="1" max="12" name="prim-start-number" id="prim-start-num" />
						<button className="button prim-button" onClick={handleGoClick}>
							GO
						</button>
						<button className="button prim-button" onClick={handleRandomizeClick}>
							RANDOMIZE
						</button>
					</div>
					<div id="prim-adjacency-list">
						<p id="prim-adj-list-label">Adjacency lists:</p>
						{generateAdjacencyListElements()}
					</div>
				</div>
			</div>
			<div id="bfs-extra" className="extra">
				<div className="fg-box">
					<p className="extra-box-text">Steps</p>
					<div className="extra-box-children">
						<ol type="1">
							<li>
								Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci sunt optio labore non, commodi deleniti quae sequi in ipsam nemo sapiente
								repellendus ratione mollitia reprehenderit voluptatem illum eligendi rem saepe!
							</li>
							<li>
								Labore placeat rem aspernatur voluptates minus soluta, cupiditate non animi dolor delectus deleniti a accusamus voluptate nostrum dolores sed?
								Corporis cupiditate accusantium fugiat quod facere similique suscipit. Dignissimos, dolorem dolores.
							</li>
							<li>
								Ea error, incidunt esse tempore expedita nihil alias numquam quibusdam eaque eligendi sed nam iste perspiciatis dicta veniam commodi nobis.
								Laudantium, hic voluptates! Aspernatur modi itaque veniam tenetur, vel sequi!
							</li>
						</ol>
					</div>
				</div>
				<div className="fg-box">
					<p className="extra-box-text">Code</p>
					<div className="extra-box-children">
						<SyntaxHighlighter language="java" style={tomorrow} showLineNumbers>{`// example code here`}</SyntaxHighlighter>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Prim
