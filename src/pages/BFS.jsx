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
		this.queue = []
		this.enqueuedList = []
		this.enqueuedBy = -1
		this.finished = false
	}

	/**
	 * This function clones and advances the current state of the BFSStateObject
	 * @returns A clone of the current state, advanced one step if possible
	 */
	step() {
		if (this.finished || this.queue.length === 0) {
			return this
		}

		// Clone this object
		let obj = new BFSStateObject(this.vertices, this.edges)
		obj.visited = this.visited
		obj.queue = this.queue
		obj.enqueuedList = this.enqueuedList
		obj.enqueuedBy = this.enqueuedBy

		// Get the first node in the queue that has not been visited, if one exists
		let node = obj.queue.shift()
		obj.enqueuedBy = obj.enqueuedList.shift()
		while (obj.visited.includes(node)) {
			node = obj.queue.shift()
			obj.enqueuedBy = obj.enqueuedList.shift()
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
			obj.queue.push(n)
			obj.enqueuedList.push(node)
		})

		return obj
	}
}

/**
 * Generates adjaency lists for the input graph G = (V, E)
 * @param {Object[]} E the set of edges in the graph
 */
export function generateAdjacencyLists(E) {
	let adjacencies = []
	for (let i = 0; i < 12; i++) {
		let arr = []
		for (let edgeStr of E.keys()) {
			let edge = JSON.parse(edgeStr)
			if (edge.to === i) {
				arr.push(edge.from)
			} else if (edge.from === i) {
				arr.push(edge.to)
			}
		}
		adjacencies.push(arr)
	}
	return adjacencies
}

/**
 * This function generates a connected graph with num vertices.
 * Each vertex will be assigned a random degree between 1 and num-1.
 * @param {number} num the number of vertices to create in the graph
 * @returns {*} G represents the created graph returned as an array to allow dereferencing,
 * where index 0 is the vertices array, and index 1 is the edge map.
 * Each vertex is an integer, each edge is a JSON string { from: int, to: int } mapped to a boolean
 * used to represent whether that edge should be highlighted in the animation.
 */
export function generateConnectedGraph(num) {
	let vertices = []
	let edges = new Map()
	for (let i = 0; i < num; i++) {
		let vertex = Math.floor(Math.random() * 12)
		while (vertices.includes(vertex)) {
			vertex = Math.floor(Math.random() * 12)
		}
		vertices.push(vertex)
		let desiredDegree = Math.min(vertices.length - 1, Math.floor(Math.random() * (num - 5) + 1))
		let numEdges = 0
		// Count the number of edges that already go to i
		for (let edgeStr of edges.keys()) {
			let edge = JSON.parse(edgeStr)
			if (edge.to === vertex) {
				numEdges++
			}
		}
		// Add edges if current degree < desiredDegree
		while (numEdges < desiredDegree) {
			// Find a different vertex j which doesn't share an edge with i
			let j = vertices[Math.floor(Math.random() * vertices.length)]
			while (
				j === vertex ||
				edges.has(JSON.stringify({ from: vertex, to: j })) ||
				edges.has(JSON.stringify({ from: vertex, to: j })) ||
				edges.has(JSON.stringify({ from: j, to: vertex })) ||
				edges.has(JSON.stringify({ from: j, to: vertex }))
			) {
				j = vertices[Math.floor(Math.random() * vertices.length)]
			}
			edges.set(JSON.stringify({ from: vertex, to: j }), false)
			numEdges++
		}
	}
	return [vertices, edges]
}

function BFS() {
	SyntaxHighlighter.registerLanguage("java", java)

	const [obj, setObj] = useState(new BFSStateObject())
	const [bfsBoxRect, setBFSBoxRect] = useState(null)
	const [animationPlaying, setAnimationPlaying] = useState(false)

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

			return [x * widthStep, y * heightStep]
		},
		[bfsBoxRect]
	)

	let generateAdjacencyListElements = useCallback(() => {
		return obj.vertices.map(vertex => (
			<div className="bfs-adjacency-list">
				<Box text={vertex + 1} key={"bfs-adj-src" + vertex} id={`bfs-adjacency-node-${vertex}`} />
				<p>:</p>
				{[...obj.edges.keys()]
					.filter(edge => JSON.parse(edge).to === vertex || JSON.parse(edge).from === vertex)
					.map(edge =>
						JSON.parse(edge).to === vertex ? (
							<Box text={JSON.parse(edge).from + 1} key={`bfs-adjacency-node-${edge}-from`} id={`bfs-adjacency-node-${vertex}-${JSON.parse(edge).from}`} />
						) : (
							<Box text={JSON.parse(edge).to + 1} key={`bfs-adjacency-node-${edge}-to`} id={`bfs-adjacency-node-${vertex}-${JSON.parse(edge).to}`} />
						)
					)}
			</div>
		))
	}, [obj])

	let canvasDraw = useCallback(() => {
		let canvas = document.getElementById("bfs-edge-canvas")
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
			let [x1, y1] = determineNodePosition(edge.from)
			let [x2, y2] = determineNodePosition(edge.to)
			x1 = x1 + 24
			x2 = x2 + 24
			y1 = y1 + 24
			y2 = y2 + 24
			ctx.beginPath()
			ctx.moveTo(Math.floor(2 * x1), Math.floor(2 * y1))
			ctx.lineTo(Math.floor(2 * x2), Math.floor(2 * y2))
			ctx.stroke()
		}
	}, [determineNodePosition, obj])

	// Set up graph
	useEffect(() => {
		for (let i = 0; i < 12; i++) {
			if (document.getElementById("bfs-b" + i)) {
				let [x, y] = determineNodePosition(i)
				animatedMove("bfs-b" + i, x + "px", y + "px", x + "px", y + "px")
			}
		}

		canvasDraw()
	}, [bfsBoxRect, canvasDraw, determineNodePosition])

	// Handle the animation
	useEffect(() => {
		if (!animationPlaying) {
			return
		}
		// Highlight current node
		let justVisited = obj.visited[obj.visited.length - 1]
		let justVisitedEl = document.getElementById("bfs-b" + justVisited)
		if (justVisitedEl !== undefined) {
			if (justVisitedEl.classList.contains("midlight")) {
				justVisitedEl.classList.remove("midlight")
			}
			justVisitedEl.classList.add("highlight")
		}

		// "Midlight" discovery edges
		let adjNode = document.getElementById("bfs-adjacency-node-" + justVisited)
		if (adjNode) {
			adjNode.classList.add("highlight")
			// Save this for DFS implementation later:
			// if (obj.visited.length >= 2) {
			// 	let prevVisited = obj.visited[obj.visited.length - 2]
			// 	let adjPrevNode = document.getElementById(`bfs-adjacency-node-${prevVisited}-${justVisited}`)
			// 	if (adjPrevNode) {
			// 		adjPrevNode.classList.add("midlight")
			// 	}
			// }
			if (obj.enqueuedBy > -1) {
				// Highlight connecting edge
				console.log(obj.edges)
				console.log(JSON.stringify({ from: obj.enqueuedBy, to: justVisited }))
				if (obj.edges.has(JSON.stringify({ from: obj.enqueuedBy, to: justVisited }))) {
					obj.edges.set(JSON.stringify({ from: obj.enqueuedBy, to: justVisited }), true)
				} else if (obj.edges.has(JSON.stringify({ from: justVisited, to: obj.enqueuedBy }))) {
					obj.edges.set(JSON.stringify({ from: justVisited, to: obj.enqueuedBy }), true)
				}
				canvasDraw()
				// Highlight corresponding edge representation in adjacency lists
				let enqueuedByEl = document.getElementById(`bfs-adjacency-node-${obj.enqueuedBy}-${justVisited}`)
				if (enqueuedByEl) {
					enqueuedByEl.classList.add("midlight")
				}
			}
		}

		// "Midlight" discovery nodes (unvisited neighbours of current node)
		obj.queue.forEach(e => {
			let el = document.getElementById("bfs-b" + e)
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
		let n = document.getElementById("bfs-start-num").value - 1
		if (obj.vertices.includes(n)) {
			obj.queue.push(n)
			setAnimationPlaying(true)
			let newObj = new BFSStateObject(obj.vertices, obj.edges)
			newObj.queue.push(n)
			newObj.enqueuedList.push(-1)
			setObj(newObj.step())
		}
	}

	function handleRandomizeClick() {
		if (!animationPlaying) {
			setObj(new BFSStateObject())
		}
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
						<input id="bfs-start-num" type="number" min="1" max="12" name="bfs-start-number" />
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
			<div id="bfs-extra" className="extra">
				<div className="fg-box">
					<p className="extra-box-text">Steps</p>
					<div className="extra-box-children">
						<ol type="1">
							<li>
								Create a queue called <code>Q</code> to keep track of vertices encountered during the traversal
							</li>
							<li>
								Create a list called <code>visited</code> to keep track of which vertices have been visited
							</li>
							<li>
								Enqueue the starting vertex in <code>Q</code>
							</li>
							<li>
								While <code>Q</code> is not empty, do the following:
							</li>
							<ol type="a">
								<li>
									Remove the first element from the front of <code>Q</code> (dequeue) and call it <code>v</code>
								</li>
								<li>
									If <code>v</code> is in <code>visited</code>, then skip to the next iteration of the loop
								</li>
								<li>
									Otherwise, add <code>v</code> to <code>visited</code> and add each neighbour <code>x</code> to <code>Q</code> (enqueue)
								</li>
							</ol>
							<li>Every vertex in the graph has now been visited</li>
						</ol>
					</div>
				</div>
				<div className="fg-box">
					<p className="extra-box-text">Code</p>
					<div className="extra-box-children">
						<SyntaxHighlighter language="java" style={tomorrow} showLineNumbers>{`private static void breadthFirstSearch(List<Integer> vertices,
	Map<Integer, List<Integer>> adjacencies) {
    // Create q and visited
    Queue<Integer> q = new LinkedList<>();
    List<Integer> visited = new ArrayList<>();
    
    // Enqueue starting node
    q.add(vertices.remove(0));
    
    // Loop
    while (!q.isEmpty()) {
        int v = q.remove(); // Dequeue
        if (!visited.contains(v)) {
            System.out.println(v);
            visited.add(v); // Mark v as visited
            for (int x : adjacencies.get(v)) {
                q.add(x); // Enqueue
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

export default BFS
