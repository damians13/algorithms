import "../styles/Prim.css"
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter"
import java from "react-syntax-highlighter/dist/cjs/languages/prism/java"
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism"
import { determineNodePosition, generateWeightedAdjacencyLists, generateWeightedConnectedGraph, setupResizeEventListener } from "../components/Graph"
import MinHeap from "../components/MinHeap"
import { useCallback, useEffect, useRef, useState } from "react"
import Box, { animatedMove } from "../components/Box"

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

	const [obj, setObj] = useState(new PrimStateObject())
	const [primBoxRect, setPrimBoxRect] = useState(null)
	const [animationPlaying, setAnimationPlaying] = useState(false)
	let numRef = useRef()

	// Setup window resize event listener and initialize bfsBoxWidth
	useEffect(() => {
		setupResizeEventListener("prim-boxes", setPrimBoxRect)
	}, [])

	let canvasDraw = useCallback(() => {
		let canvas = document.getElementById("prim-edge-canvas")
		let r = canvas.getBoundingClientRect()
		canvas.width = 2 * r.width
		canvas.height = 2 * r.height
		let ctx = canvas.getContext("2d", { alpha: false })
		ctx.fillStyle = "#333333"
		ctx.clearRect(0, 0, 2 * canvas.clientWidth, 2 * canvas.clientHeight)
		ctx.fillRect(0, 0, 2 * canvas.clientWidth, 2 * canvas.clientHeight)
		for (let edgeStr of obj.edges.keys()) {
			let edge = JSON.parse(edgeStr)
			ctx.lineWidth = edge.weight / 1.6 + 4
			ctx.strokeStyle = obj.edges.get(edgeStr) ? window.getComputedStyle(document.querySelector(":root")).getPropertyValue("--mid") : "#1e1e1e"
			let [x1, y1] = determineNodePosition(primBoxRect, edge.from)
			let [x2, y2] = determineNodePosition(primBoxRect, edge.to)
			x1 = x1 + 24
			x2 = x2 + 24
			y1 = y1 + 24
			y2 = y2 + 24
			ctx.beginPath()
			ctx.moveTo(Math.floor(2 * x1), Math.floor(2 * y1))
			ctx.lineTo(Math.floor(2 * x2), Math.floor(2 * y2))
			ctx.stroke()
		}
	}, [obj, primBoxRect])

	// Set up graph
	useEffect(() => {
		for (let i = 0; i < 12; i++) {
			if (document.getElementById("prim-b" + i)) {
				let [x, y] = determineNodePosition(primBoxRect, i)
				animatedMove("prim-b" + i, x + "px", y + "px", x + "px", y + "px")
			}
		}

		canvasDraw()
	}, [primBoxRect, canvasDraw])

	function handleGoClick() {
		if (animationPlaying) {
			return
		}
		let n = numRef.current - 1
		if (obj.vertices.includes(n)) {
			obj.queue.push(n)
			setAnimationPlaying(true)
			let newObj = new PrimStateObject(obj.vertices, obj.edges)
			newObj.queue.push(n)
			newObj.enqueuedList.push(-1)
			setObj(newObj.step())
		}
	}

	function handleRandomizeClick() {
		if (!animationPlaying) {
			setObj(new PrimStateObject())
		}
	}

	let generateAdjacencyListElements = useCallback(() => {
		return obj.vertices.map(vertex => (
			<div className="prim-adjacency-list">
				<Box text={vertex + 1} key={"prim-adj-src" + vertex} id={`prim-adjacency-node-${vertex}`} />
				<p>:</p>
				{[...obj.edges.keys()]
					.filter(edge => JSON.parse(edge).to === vertex || JSON.parse(edge).from === vertex)
					.map(edge =>
						JSON.parse(edge).to === vertex ? (
							<Box
								text={`${JSON.parse(edge).from + 1} (${JSON.parse(edge).weight})`}
								key={`prim-adjacency-node-${edge}-from`}
								id={`prim-adjacency-node-${vertex}-${JSON.parse(edge).from}`}
							/>
						) : (
							<Box
								text={`${JSON.parse(edge).to + 1} (${JSON.parse(edge).weight})`}
								key={`prim-adjacency-node-${edge}-to`}
								id={`prim-adjacency-node-${vertex}-${JSON.parse(edge).to}`}
							/>
						)
					)}
			</div>
		))
	}, [obj])

	return (
		<div className="page">
			<div id="prim-box" className="fg-box">
				<p className="title-text">Prim's algorithm</p>
				<p className="title-description">minimum spanning tree of a weighted graph</p>
				<div id="prim-content">
					<div id="prim-boxes">
						<canvas id="prim-edge-canvas"></canvas>
						{(() => obj.vertices.map(vertex => <Box text={vertex + 1} id={"prim-b" + vertex} key={"prim-box" + vertex} />))()}
					</div>
					<div id="prim-buttons">
						<label htmlFor="prim-start-number">Start from</label>
						<input type="number" min="1" max="12" name="prim-start-number" id="prim-start-num" ref={numRef} />
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
