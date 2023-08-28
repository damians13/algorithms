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
		this.mostRecentEdge = null
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
		obj.mostRecentEdge = edge

		// Determine which vertex is new and mark it as visited
		let vertex
		if (edge.from === null) {
			// First vertex case
			vertex = edge.to
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
			ctx.lineWidth = 16 - edge.weight / 2
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
		let n = numRef.current.value - 1
		if (obj.vertices.includes(n)) {
			let newObj = new PrimStateObject(obj.vertices, obj.edges)
			newObj.edgeQueue.insert({ from: null, to: n, weight: 0 })
			setObj(newObj.step())
			setAnimationPlaying(true)
		}
	}

	function handleRandomizeClick() {
		if (!animationPlaying) {
			setObj(new PrimStateObject())
		}
	}

	// Handle the animation
	useEffect(() => {
		if (!animationPlaying) {
			return
		}
		// Highlight current node
		let justVisited = obj.visited[obj.visited.length - 1]
		let justVisitedEl = document.getElementById("prim-b" + justVisited)
		if (justVisitedEl !== undefined) {
			if (justVisitedEl.classList.contains("midlight")) {
				justVisitedEl.classList.remove("midlight")
			}
			justVisitedEl.classList.add("highlight")
		}

		// "Midlight" discovery edges
		let adjNode = document.getElementById("prim-adjacency-node-" + justVisited)
		if (adjNode) {
			adjNode.classList.add("highlight")
			if (obj.mostRecentEdge !== null && obj.mostRecentEdge.from !== null) {
				let enqueuedByVertex = obj.mostRecentEdge.from === justVisited ? obj.mostRecentEdge.to : obj.mostRecentEdge.from
				// Highlight connecting edge
				let matchStr1 = JSON.stringify({ from: enqueuedByVertex, to: justVisited })
				let matchStr2 = JSON.stringify({ from: justVisited, to: enqueuedByVertex })
				matchStr1 = matchStr1.substring(0, matchStr1.length - 1) + ","
				matchStr2 = matchStr2.substring(0, matchStr2.length - 1) + ","
				// Search through edges to find the matching edge, necessary because we don't know the weight
				console.log(matchStr1)
				console.log(matchStr2)
				for (let edgeStr of obj.edges.keys()) {
					console.log(edgeStr)
					if (edgeStr.includes(matchStr1)) {
						obj.edges.set(edgeStr, true)
						console.log("match1")
						break
					} else if (edgeStr.includes(matchStr2)) {
						obj.edges.set(edgeStr, true)
						console.log("match2")
						break
					}
				}
				console.log("\n")

				canvasDraw()
				// Highlight corresponding edge representation in adjacency lists
				let enqueuedByEl = document.getElementById(`prim-adjacency-node-${enqueuedByVertex}-${justVisited}`)
				if (enqueuedByEl) {
					enqueuedByEl.classList.add("midlight")
				}
			}
		}

		// "Midlight" discovery nodes (unvisited neighbours of current node)
		obj.edgeQueue.array.forEach(enqueuedEdge => {
			let e = enqueuedEdge.from === justVisited ? enqueuedEdge.to : enqueuedEdge.from
			let el = document.getElementById("prim-b" + e)
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
					obj.edges.set(JSON.stringify({ from: edge.from, to: edge.to, weight: edge.weight }), false)
				}
			}
			canvasDraw()
		} else {
			// Continue animation
			setTimeout(() => setObj(obj.step()), 1000)
		}
	}, [obj, canvasDraw, animationPlaying])

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
						<p id="prim-adj-list-label">Adjacency lists: (with weights)</p>
						{generateAdjacencyListElements()}
					</div>
				</div>
			</div>
			<div id="bfs-extra" className="extra">
				<div className="fg-box">
					<p className="extra-box-text">Steps</p>
					<div className="extra-box-children">
						<i>Edges with lower weights are shown with thicker lines.</i>
						<ol type="1">
							<li>
								Create a minimum priority queue <code>Q</code> to store encountered edges, using an edge's weight as its priority
							</li>
							<li>Create lists to store edges in the spanning tree (result) and nodes that have been visited</li>
							<li>
								Mark the starting vertex as visited and add all edges incident on it to <code>Q</code>
							</li>
							<li>
								While <code>Q</code> is not empty, do the following:
							</li>
							<ol type="a">
								<li>
									Get the minimum priority edge from <code>Q</code> that is not internal in the spanning tree (one vertex of the edge is not in the spanning
									tree), call this edge <code>e</code>. If there is no such edge, the algorithm is finished
								</li>
								<li>
									Add <code>e</code> to the spanning tree
								</li>
								<li>Mark the newly encountered vertex as visited</li>
								<li>
									Add each edge incident on the newly encountered vertex to <code>Q</code>
								</li>
							</ol>
							<li>Each vertex connected to the starting vertex either directly or indirectly is now in the spanning tree, and the algorithm is finished</li>
						</ol>
					</div>
				</div>
				<div className="fg-box">
					<p className="extra-box-text">Code</p>
					<div className="extra-box-children">
						<SyntaxHighlighter language="java" style={tomorrow} showLineNumbers>{`public class Edge {
    public int from, to, weight;
    public Edge(int from, int to, int weight) {
        this.from = from;
        this.to = to;
        this.weight = weight;
    }
}

class CompareEdges implements Comparator<Edge> {
	public int compare(Edge a, Edge b) {
		return a.weight - b.weight;
	}
}

private List<Edge> prim(int start, List<Integer> vertices,
    Map<Integer, List<Edge>> adjacencies) {
    // Setup
	Comparator<Edge> c = new CompareEdges();
	PriorityQueue<Edge> Q = new PriorityQueue<>(c);
	List<Edge> spanningTree = new ArrayList<>();
	List<Integer> visited = new ArrayList<>();
	// Start the algorithm
	visited.add(start);
	for (Edge incidentEdge : adjacencies.get(start)) {
	    Q.add(incidentEdge);
	}
	// Main loop
	while (!Q.isEmpty()) {
	    // Get the minimum weighted edge in the queue that is not
	    // internal in the spanning tree
	    Edge e = Q.remove();
	    while (visited.contains(e.from) && visited.contains(e.to)) {
	        try {
    	        e = Q.remove();
	        } catch (NoSuchElementException ex) {
	            // No more edges in the queue, algorithm is finished
	            return spanningTree;
	        }
	    }
	    // Determine which vertex was just connected to the tree
	    int newVertex = visited.contains(e.from) ? e.to : e.from;
	    // Mark this edge as part of the tree and the newly
	    // connected vertex as visited
	    spanningTree.add(e);
	    visited.add(newVertex);
	    // Enqueue all edges which are incident on the new vertex
	    for (Edge incidentEdge : adjacencies.get(newVertex)) {
	        Q.add(incidentEdge);
	    }
	}
	return spanningTree;
}`}</SyntaxHighlighter>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Prim
