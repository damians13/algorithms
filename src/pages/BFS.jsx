import "../styles/BFS.css"
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter"
import java from "react-syntax-highlighter/dist/cjs/languages/prism/java"
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism"
import Box, { animatedMove } from "../components/Box"
import { useCallback, useEffect, useState } from "react"

/**
 * This class represents the state of the BFS algorithm and supports the associated animations
 */
export class BFSStateObject {
	constructor(vertices, edges) {
		if (typeof vertices === "undefined" || typeof edges === "undefined") {
			let num = Math.floor(Math.random() * 3 + 5)
			let [V, E] = generateConnectedGraph(num)
			this.vertices = V
			this.edges = E
		} else {
			this.vertices = vertices
			this.edges = edges
		}

		// Populate adjacency lists
		this.adjacencies = generateAdjacencyLists(this.vertices, this.edges)

		this.visited = []
		this.stack = []
		this.finished = false
	}

	/**
	 * This function clones and advances the current state of the BFSStateObject
	 * @returns A clone of the current state, advanced one step if possible
	 */
	step() {
		if (this.finished || this.stack.length === 0) {
			return this
		}

		// Clone this object
		let obj = new BFSStateObject(this.vertices, this.edges)
		obj.visited = this.visited
		obj.stack = this.stack

		// Get the first node in the stack that has not been visited, if one exists
		let node = obj.stack.pop()
		while (obj.visited.includes(node)) {
			node = obj.stack.pop()
		}
		if (node === undefined) {
			// No more nodes in the stack, we have traversed the entire tree
			obj.finished = true
			return obj
		}

		// Mark this node as visited
		obj.visited.push(node)

		// Push node's neighbours on to the stack
		let neighbours = obj.adjacencies[node - 1]
		neighbours.forEach(n => {
			obj.stack.push(n)
		})

		return obj
	}
}

/**
 * Generates adjaency lists for the input graph G = (V, E)
 * @param {number[]} V the list of vertices in the graph
 * @param {Object[]} E the set of edges in the graph
 */
export function generateAdjacencyLists(V, E) {
	let adjacencies = []
	for (let i = 1; i <= V.length; i++) {
		let arr = []
		E.forEach(e => {
			let edge = JSON.parse(e)
			if (edge.to === i) {
				arr.push(edge.from)
			} else if (edge.from === i) {
				arr.push(edge.to)
			}
		})
		adjacencies.push(arr)
	}
	return adjacencies
}

/**
 * This function generates a connected graph with num vertices.
 * Each vertex will be assigned a random degree between 1 and num-1.
 * @param {number} num the number of vertices to create in the graph
 * @returns {*} G represents the created graph returned as an array to allow dereferencing,
 * where index 0 is the vertices array, and index 1 is the edge set.
 * Each vertex is an integer, each edge is a JSON string { from: int, to: int }.
 */
export function generateConnectedGraph(num) {
	let vertices = []
	let edges = new Set()
	for (let i = 0; i < num; i++) {
		let vertex = Math.floor(Math.random() * 12)
		while (vertices.includes(vertex)) {
			vertex = Math.floor(Math.random() * 12)
		}
		vertices.push(vertex)
		let desiredDegree = Math.min(vertices.length - 1, Math.floor(Math.random() * (num - 5) + 1))
		let numEdges = 0
		// Count the number of edges that already go to i
		edges.forEach(e => {
			let edge = JSON.parse(e)
			if (edge.to === vertex) {
				numEdges++
			}
		})
		// Add edges if current degree < desiredDegree
		while (numEdges < desiredDegree) {
			// Find a different vertex j which doesn't share an edge with i
			let j = vertices[Math.floor(Math.random() * vertices.length)]
			while (j === vertex || edges.has(JSON.stringify({ from: vertex, to: j })) || edges.has(JSON.stringify({ from: j, to: vertex }))) {
				j = vertices[Math.floor(Math.random() * vertices.length)]
			}
			edges.add(JSON.stringify({ from: vertex, to: j, highlight: false }))
			numEdges++
		}
	}
	return [vertices, edges]
}

function BFS() {
	SyntaxHighlighter.registerLanguage("java", java)

	const [obj, setObj] = useState(new BFSStateObject())
	const [bfsBoxRect, setBFSBoxRect] = useState(null)

	// Setup window resize event listener and initialize bfsBoxWidth
	useEffect(() => {
		function handleResize() {
			let boxes = document.getElementById("bfs-boxes")
			if (boxes === null) {
				return
			}
			setBFSBoxRect(boxes.getBoundingClientRect())
		}
		window.addEventListener("resize", handleResize)
		// Trigger the initial box animation and update the state
		handleResize()
	}, [])

	let determineNodePosition = useCallback(
		i => {
			if (!bfsBoxRect) {
				return [0, 0]
			}
			let widthStep = bfsBoxRect.width / 9
			let heightStep = bfsBoxRect.height / 9
			let xOffset = bfsBoxRect.left
			let yOffset = bfsBoxRect.top
			let x, y

			switch (i) {
				case 0:
					x = 3
					y = 0
					break
				case 1:
					x = 5
					y = 0
					break
				case 2:
					x = 7
					y = 1
					break
				case 3:
					x = 8
					y = 3
					break
				case 4:
					x = 8
					y = 5
					break
				case 5:
					x = 7
					y = 7
					break
				case 6:
					x = 5
					y = 8
					break
				case 7:
					x = 3
					y = 8
					break
				case 8:
					x = 1
					y = 7
					break
				case 9:
					x = 0
					y = 5
					break
				case 10:
					x = 0
					y = 3
					break
				case 11:
					x = 1
					y = 1
					break
				default:
					console.error("Unexpected index given: " + i)
			}

			return [x * widthStep + xOffset, y * heightStep + yOffset]
		},
		[bfsBoxRect]
	)

	let generateAdjacencyListElements = useCallback(() => {
		return obj.vertices.map(vertex => (
			<div className="bfs-adjacency-list">
				<Box text={vertex + 1} key={"bfs-adj-src" + vertex} />
				<p>:</p>
				{[...obj.edges]
					.filter(edge => JSON.parse(edge).to === vertex || JSON.parse(edge).from === vertex)
					.map(edge =>
						JSON.parse(edge).to === vertex ? (
							<Box text={JSON.parse(edge).from + 1} key={`bfs-adjacency-node-${edge}-from`} />
						) : (
							<Box text={JSON.parse(edge).to + 1} key={`bfs-adjacency-node-${edge}-to`} />
						)
					)}
			</div>
		))
	}, [obj])

	// Set up graph
	useEffect(() => {
		for (let i = 0; i < 12; i++) {
			if (document.getElementById("bfs-b" + i)) {
				let [x, y] = determineNodePosition(i)
				animatedMove("bfs-b" + i, x + "px", y + "px", x + "px", y + "px")
			}
		}

		let canvas = document.getElementById("bfs-edge-canvas")
		let r = canvas.getBoundingClientRect()
		canvas.width = 2 * r.width
		canvas.height = 2 * r.height
		let ctx = canvas.getContext("2d", { alpha: false })
		ctx.lineWidth = 8
		ctx.fillStyle = "#333333"
		ctx.clearRect(0, 0, 2 * canvas.clientWidth, 2 * canvas.clientHeight)
		ctx.fillRect(0, 0, 2 * canvas.clientWidth, 2 * canvas.clientHeight)
		obj.edges.forEach(e => {
			let edge = JSON.parse(e)
			ctx.strokeStyle = edge.highlight ? window.getComputedStyle(document.querySelector(":root")).getPropertyValue("--bright") : "#1e1e1e"
			let [x1, y1] = determineNodePosition(edge.from)
			let [x2, y2] = determineNodePosition(edge.to)
			x1 = x1 - r.left + 24
			x2 = x2 - r.left + 24
			y1 = y1 - r.top + 24
			y2 = y2 - r.top + 24
			ctx.moveTo(Math.floor(2 * x1), Math.floor(2 * y1))
			ctx.lineTo(Math.floor(2 * x2), Math.floor(2 * y2))
			ctx.stroke()
		})
	}, [bfsBoxRect, determineNodePosition, obj.edges])

	function handleGoClick() {
		console.log("Start your engines!")
	}

	function handleRandomizeClick() {
		setObj(new BFSStateObject())
	}

	return (
		<div className="page">
			<div id="bfs-box" className="fg-box">
				<p className="title-text">breadth first search</p>
				<p className="title-description">graph traversal algorithm</p>
				<div id="bfs-content">
					<div id="bfs-boxes">
						<canvas id="bfs-edge-canvas">Your browser doesn't support the HTML canvas.</canvas>
						{(() => obj.vertices.map(vertex => <Box text={vertex + 1} id={"bfs-b" + vertex} key={"bfs-box" + vertex} />))()}
					</div>
					<div id="bfs-buttons">
						<label htmlFor="bfs-start-number">Start from</label>
						<input type="number" min="1" max="12" name="bfs-start-number" />
						<button className="button bfs-button" onClick={handleGoClick}>
							GO
						</button>
						<button className="button bfs-button" onClick={handleRandomizeClick}>
							RANDOMIZE
						</button>
					</div>
					<div id="bfs-adjacency-list">
						<p id="bfs-adj-list-label">Adjacency lists:</p>
						{generateAdjacencyListElements()}
					</div>
				</div>
			</div>
			<div className="extra">
				<div className="fg-box">
					<p className="extra-box-text">Steps</p>
					<div className="extra-box-children">
						<ol type="1">
							<li>step one</li>
							<li>step 2</li>
						</ol>
					</div>
				</div>
				<div className="fg-box">
					<p className="extra-box-text">Code</p>
					<div className="extra-box-children">
						<SyntaxHighlighter language="java" style={tomorrow} showLineNumbers>{`// Code goes here!`}</SyntaxHighlighter>
					</div>
				</div>
			</div>
		</div>
	)
}

export default BFS
