import "../styles/DFS.css"
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter"
import java from "react-syntax-highlighter/dist/cjs/languages/prism/java"
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism"
import Box, { animatedMove } from "../components/Box"
import { useCallback, useEffect, useState } from "react"
import { determineNodePosition, generateAdjacencyLists, generateConnectedGraph, setupResizeEventListener } from "../components/Graph"

/**
 * This class represents the state of the DFS algorithm and supports the associated animations
 */
export class DFSStateObject {
	constructor(vertices, edges) {
		if (typeof vertices === "undefined" || typeof edges === "undefined") {
			let num = Math.floor(Math.random() * 3 + 7)
			let [V, E] = generateConnectedGraph(num)
			this.vertices = V
			this.edges = E
		} else {
			this.vertices = vertices
			this.edges = edges
		}

		// Populate adjacency lists
		this.adjacencies = generateAdjacencyLists(this.edges)

		this.visited = []
		this.stack = []
		this.pushedList = []
		this.pushedBy = -1
		this.finished = false
	}

	/**
	 * This function clones and advances the current state of the DFSStateObject
	 * @returns A clone of the current state, advanced one step if possible
	 */
	step() {
		if (this.finished || this.stack.length === 0) {
			return this
		}

		// Clone this object
		let obj = new DFSStateObject(this.vertices, this.edges)
		obj.visited = this.visited
		obj.stack = this.stack
		obj.pushedList = this.pushedList
		obj.pushedBy = this.pushedBy

		// Get the first node in the queue that has not been visited, if one exists
		let node = obj.stack.pop()
		obj.pushedBy = obj.pushedList.pop()
		while (obj.visited.includes(node)) {
			node = obj.stack.pop()
			obj.pushedBy = obj.pushedList.pop()
		}
		if (node === undefined) {
			// No more nodes in the queue, we have traversed the entire tree
			obj.finished = true
			return obj
		}

		// Mark this node as visited
		obj.visited.push(node)

		// Push node's neighbours on to the queue
		let neighbours = obj.adjacencies[node]
		neighbours.forEach(n => {
			obj.stack.push(n)
			obj.pushedList.push(node)
		})

		return obj
	}
}

function DFS() {
	SyntaxHighlighter.registerLanguage("java", java)

	const [obj, setObj] = useState(new DFSStateObject())
	const [dfsBoxRect, setDFSBoxRect] = useState(null)
	const [animationPlaying, setAnimationPlaying] = useState(false)

	// Setup window resize event listener and initialize dfsBoxWidth
	useEffect(() => {
		setupResizeEventListener("dfs-boxes", setDFSBoxRect)
	}, [])

	let generateAdjacencyListElements = useCallback(() => {
		return obj.vertices.map(vertex => (
			<div className="dfs-adjacency-list">
				<Box text={vertex + 1} key={"dfs-adj-src" + vertex} id={`dfs-adjacency-node-${vertex}`} />
				<p>:</p>
				{[...obj.edges.keys()]
					.filter(edge => JSON.parse(edge).to === vertex || JSON.parse(edge).from === vertex)
					.map(edge =>
						JSON.parse(edge).to === vertex ? (
							<Box text={JSON.parse(edge).from + 1} key={`dfs-adjacency-node-${edge}-from`} id={`dfs-adjacency-node-${vertex}-${JSON.parse(edge).from}`} />
						) : (
							<Box text={JSON.parse(edge).to + 1} key={`dfs-adjacency-node-${edge}-to`} id={`dfs-adjacency-node-${vertex}-${JSON.parse(edge).to}`} />
						)
					)}
			</div>
		))
	}, [obj])

	let canvasDraw = useCallback(() => {
		let canvas = document.getElementById("dfs-edge-canvas")
		let r = canvas.getBoundingClientRect()
		canvas.width = 2 * r.width
		canvas.height = 2 * r.height
		let ctx = canvas.getContext("2d", { alpha: false })
		ctx.lineWidth = 8
		ctx.fillStyle = "#333333"
		ctx.clearRect(0, 0, 2 * canvas.clientWidth, 2 * canvas.clientHeight)
		ctx.fillRect(0, 0, 2 * canvas.clientWidth, 2 * canvas.clientHeight)
		for (let edgeStr of obj.edges.keys()) {
			let edge = JSON.parse(edgeStr)
			ctx.strokeStyle = obj.edges.get(edgeStr) ? window.getComputedStyle(document.querySelector(":root")).getPropertyValue("--mid") : "#1e1e1e"
			let [x1, y1] = determineNodePosition(dfsBoxRect, edge.from)
			let [x2, y2] = determineNodePosition(dfsBoxRect, edge.to)
			x1 = x1 + 24
			x2 = x2 + 24
			y1 = y1 + 24
			y2 = y2 + 24
			ctx.beginPath()
			ctx.moveTo(Math.floor(2 * x1), Math.floor(2 * y1))
			ctx.lineTo(Math.floor(2 * x2), Math.floor(2 * y2))
			ctx.stroke()
		}
	}, [dfsBoxRect, obj])

	// Set up graph
	useEffect(() => {
		for (let i = 0; i < 12; i++) {
			if (document.getElementById("dfs-b" + i)) {
				let [x, y] = determineNodePosition(dfsBoxRect, i)
				animatedMove("dfs-b" + i, x + "px", y + "px", x + "px", y + "px")
			}
		}

		canvasDraw()
	}, [dfsBoxRect, canvasDraw])

	// Handle the animation
	useEffect(() => {
		if (!animationPlaying) {
			return
		}
		// Highlight current node
		let justVisited = obj.visited[obj.visited.length - 1]
		let justVisitedEl = document.getElementById("dfs-b" + justVisited)
		if (justVisitedEl !== undefined) {
			if (justVisitedEl.classList.contains("midlight")) {
				justVisitedEl.classList.remove("midlight")
			}
			justVisitedEl.classList.add("highlight")
		}

		// "Midlight" discovery edges
		let adjNode = document.getElementById("dfs-adjacency-node-" + justVisited)
		if (adjNode) {
			adjNode.classList.add("highlight")
			if (obj.pushedBy > -1) {
				// Highlight connecting edge
				console.log(obj.edges)
				console.log(JSON.stringify({ from: obj.pushedBy, to: justVisited }))
				if (obj.edges.has(JSON.stringify({ from: obj.pushedBy, to: justVisited }))) {
					obj.edges.set(JSON.stringify({ from: obj.pushedBy, to: justVisited }), true)
				} else if (obj.edges.has(JSON.stringify({ from: justVisited, to: obj.pushedBy }))) {
					obj.edges.set(JSON.stringify({ from: justVisited, to: obj.pushedBy }), true)
				}
				canvasDraw()
				// Highlight corresponding edge representation in adjacency lists
				let enqueuedByEl = document.getElementById(`dfs-adjacency-node-${obj.pushedBy}-${justVisited}`)
				if (enqueuedByEl) {
					enqueuedByEl.classList.add("midlight")
				}
			}
		}

		// "Midlight" discovery nodes (unvisited neighbours of current node)
		obj.stack.forEach(e => {
			let el = document.getElementById("dfs-b" + e)
			if (!el.classList.contains("midlight") && !el.classList.contains("highlight")) {
				el.classList.add("midlight")
			}
		})

		// Cleanup if applicable
		if (obj.finished) {
			setAnimationPlaying(false)
			let highlighted = [...document.querySelectorAll(".highlight")]
			highlighted.forEach(e => e.classList.remove("highlight"))
			let midlighted = [...document.querySelectorAll(".midlight")]
			midlighted.forEach(e => e.classList.remove("midlight"))
			for (let edgeStr of obj.edges.keys()) {
				let edge = JSON.parse(edgeStr)
				if (obj.edges.get(edgeStr)) {
					obj.edges.set(JSON.stringify({ from: edge.from, to: edge.to }), false)
				}
			}
			canvasDraw()
		} else {
			// Continue animation
			setTimeout(() => setObj(obj.step()), 1000)
		}
	}, [animationPlaying, canvasDraw, obj])

	function handleGoClick() {
		if (animationPlaying) {
			return
		}
		let n = document.getElementById("dfs-start-num").value - 1
		if (obj.vertices.includes(n)) {
			obj.stack.push(n)
			setAnimationPlaying(true)
			let newObj = new DFSStateObject(obj.vertices, obj.edges)
			newObj.stack.push(n)
			newObj.pushedList.push(-1)
			setObj(newObj.step())
		}
	}

	function handleRandomizeClick() {
		if (!animationPlaying) {
			setObj(new DFSStateObject())
		}
	}

	return (
		<div className="page">
			<div id="dfs-box" className="fg-box">
				<p className="title-text">depth first search</p>
				<p className="title-description">graph traversal algorithm</p>
				<div id="dfs-content">
					<div id="dfs-boxes">
						<canvas id="dfs-edge-canvas">Your browser doesn't support the HTML canvas.</canvas>
						{(() => obj.vertices.map(vertex => <Box text={vertex + 1} id={"dfs-b" + vertex} key={"dfs-box" + vertex} />))()}
					</div>
					<div id="dfs-buttons">
						<label htmlFor="dfs-start-number">Start from</label>
						<input id="dfs-start-num" type="number" min="1" max="12" name="dfs-start-number" />
						<button className="button dfs-button" onClick={handleGoClick}>
							GO
						</button>
						<button className="button dfs-button" onClick={handleRandomizeClick}>
							RANDOMIZE
						</button>
					</div>
					<div id="dfs-adjacency-list">
						<p id="dfs-adj-list-label">Adjacency lists:</p>
						{generateAdjacencyListElements()}
					</div>
				</div>
			</div>
			<div id="dfs-extra" className="extra">
				<div className="fg-box">
					<p className="extra-box-text">Steps</p>
					<div className="extra-box-children">
						<ol type="1">
							<li>
								Create a stack called <code>s</code> to keep track of vertices encountered during the traversal
							</li>
							<li>
								Create a list called <code>visited</code> to keep track of which vertices have been visited
							</li>
							<li>
								Push the starting vertex to <code>s</code>
							</li>
							<li>
								While <code>s</code> is not empty, do the following:
							</li>
							<ol type="a">
								<li>
									Remove the first element from the top of <code>s</code> (pop) and call it <code>v</code>
								</li>
								<li>
									If <code>v</code> is in <code>visited</code>, then skip to the next iteration of the loop
								</li>
								<li>
									Otherwise, add <code>v</code> to <code>visited</code> and add each neighbour <code>x</code> to <code>s</code> (push)
								</li>
							</ol>
							<li>Every vertex in the graph has now been visited</li>
						</ol>
					</div>
				</div>
				<div className="fg-box">
					<p className="extra-box-text">Code</p>
					<div className="extra-box-children">
						<SyntaxHighlighter language="java" style={tomorrow} showLineNumbers>{`private static void depthFirstSearch(List<Integer> vertices,
	Map<Integer, List<Integer>> adjacencies) {
    // Create s and visited
    Deque<Integer> s = new LinkedList<>();
    List<Integer> visited = new ArrayList<>();
    
    // Push the starting node
    s.push(vertices.remove(0));
    
    // Loop
    while (!s.isEmpty()) {
        int v = s.pop();
        if (!visited.contains(v)) {
            System.out.println(v); // Do something with the vertex
            visited.add(v); // Mark v as visited
            for (int x : adjacencies.get(v)) {
                s.push(x);
            }
        }
    }
}`}</SyntaxHighlighter>
					</div>
				</div>
			</div>
		</div>
	)
}

export default DFS
