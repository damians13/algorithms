export function setupResizeEventListener(boxesID, setRectCallback) {
	function handleResize() {
		let boxes = document.getElementById(boxesID)
		if (boxes === null) {
			return
		}
		setRectCallback(boxes.getBoundingClientRect())
	}
	window.addEventListener("resize", handleResize)
	// Trigger the initial box animation and update the state
	handleResize()
}
/*
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

export function determineNodePosition(rect, i) {
	if (!rect) {
		return [0, 0]
	}
	let widthStep = rect.width / 9
	let heightStep = rect.height / 9
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
}
