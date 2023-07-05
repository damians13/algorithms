import { useEffect, useState } from "react"
import "./styles/App.css"
import Sidebar from "./components/Sidebar"
import Home from "./pages/Home"
import BinarySearch, { generateSortedArray } from "./pages/BinarySearch"

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
	const [page, setPage] = useState()

	function random() {
		return <BinarySearch nums={generateSortedArray(9)} />
	}

	useEffect(() => {
		if (!hasLoaded) {
			setHasLoaded(true)
			setColourScheme()
			setPage(<Home random={random} setPage={setPage} />)
		}
	}, [hasLoaded])

	return (
		<div id="app">
			<Sidebar random={random} setColourScheme={setColourScheme} setPage={setPage} />
			{page}
		</div>
	)
}

export default App
