import { useEffect, useState } from "react"
import "./styles/App.css"
import Sidebar from "./components/Sidebar"
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import BinarySearch from "./pages/BinarySearch"
import SelectionSort from "./pages/SelectionSort"
import InsertionSort from "./pages/InsertionSort"

function setColourScheme() {
	let root = document.querySelector(":root")

	let rawRed = Math.floor(Math.random() * 256)
	let rawGreen = Math.floor(Math.random() * 256)
	let rawBlue = Math.floor(Math.random() * 256)

	let total = Math.sqrt(rawRed ** 2 + rawGreen ** 2 + rawBlue ** 2)

	let brightRed = (rawRed / total) * 255 * 0.87
	let brightGreen = (rawGreen / total) * 255 * 0.87
	let brightBlue = (rawBlue / total) * 255 * 0.87

	let midRed = (rawRed / total) * 255 * 0.47
	let midGreen = (rawGreen / total) * 255 * 0.47
	let midBlue = (rawBlue / total) * 255 * 0.47

	let darkRed = (rawRed / total) * 255 * 0.22
	let darkGreen = (rawGreen / total) * 255 * 0.22
	let darkBlue = (rawBlue / total) * 255 * 0.22

	root.style.setProperty("--dark", "rgb(" + darkRed + ", " + darkGreen + ", " + darkBlue + ")")
	root.style.setProperty("--mid", "rgb(" + midRed + ", " + midGreen + ", " + midBlue + ")")
	root.style.setProperty("--bright", "rgb(" + brightRed + ", " + brightGreen + ", " + brightBlue + ")")
}

function App() {
	const [hasLoaded, setHasLoaded] = useState(false)

	const pages = [
		{ path: "/binary-search", element: <BinarySearch /> },
		{ path: "/selection-sort", element: <SelectionSort /> },
		{ path: "/insertion-sort", element: <InsertionSort /> },
	]

	// Returns the path of a randomly chosen page
	function random() {
		return pages[Math.floor(Math.random() * pages.length)].path
	}

	useEffect(() => {
		if (!hasLoaded) {
			setHasLoaded(true)
			setColourScheme()
		}
	}, [hasLoaded])

	return (
		<div id="app">
			<Sidebar random={random} setColourScheme={setColourScheme} />
			<Routes>
				<Route path="/" element={<Home random={random} />} />
				{(() => {
					let routes = []
					pages.forEach(page => routes.push(<Route path={page.path} element={page.element} key={page.path} />))
					return routes
				})()}
			</Routes>
		</div>
	)
}

export default App
