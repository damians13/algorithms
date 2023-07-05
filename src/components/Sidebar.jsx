import React, { useEffect, useState } from "react"
import "../styles/Sidebar.css"
import Home from "../pages/Home"
import BinarySearch, { generateSortedArray } from "../pages/BinarySearch"
import SelectionSort from "../pages/SelectionSort"

function Sidebar({ random, setColourScheme, setPage }) {
	const [expanded, setExpanded] = useState(true)

	useEffect(() => {
		setExpanded(false)
	}, [])

	useEffect(() => {
		let hamburgerTop = document.getElementById("sidebar-hamburger-top")
		let hamburgerMiddle = document.getElementById("sidebar-hamburger-middle")
		let hamburgerBottom = document.getElementById("sidebar-hamburger-bottom")
		let sidebarDiv = document.getElementById("sidebar")
		let sidebarOptions = document.getElementById("sidebar-options")
		let transition = {
			fill: "forwards",
			easing: "ease-in-out",
			duration: 150,
		}
		if (expanded) {
			// Animate from hamburger to X
			hamburgerTop.animate([{ transform: "rotate(45deg) scaleX(141%)", top: "1.8vh" }], transition)
			hamburgerMiddle.animate([{ transform: "scale(0%)", top: "0px" }], transition)
			hamburgerBottom.animate([{ transform: "rotate(-45deg) scaleX(141%)", top: "-1.4vh" }], transition)
			sidebarDiv.animate([{ width: "24vh" }], transition)
			sidebarOptions.animate([{ opacity: "0%" }, { opacity: "100%" }], transition)
		} else {
			// Animate from X to hamburger
			hamburgerTop.animate([{ transform: "rotate(0deg)", top: "0px" }], transition)
			hamburgerMiddle.animate([{ transform: "scale(100%)", top: "0px" }], transition)
			hamburgerBottom.animate([{ transform: "rotate(0deg)", top: "0px" }], transition)
			sidebarDiv.animate([{ width: "5vh" }], transition)
			// sidebarOptions.animate([{ opacity: "100%" }, { opacity: "0%" }], transition) // TODO: make this have effect
		}
	}, [expanded])

	function handleExpandClick() {
		setExpanded(!expanded)
	}

	function handleHomeClick() {
		window.dispatchEvent(new Event("resize")) // Clear any window resize event listeners
		setPage(<Home random={random} setPage={setPage} />)
	}

	function handleRandomAlgorithmClick() {
		setPage(random())
	}

	function handleBinarySearchClick() {
		window.dispatchEvent(new Event("resize")) // Clear any window resize event listeners
		setPage(<BinarySearch nums={generateSortedArray(9)} />)
	}

	function handleSelectionSortClick() {
		window.dispatchEvent(new Event("resize")) // Clear any window resize event listeners
		setPage(<SelectionSort num={9} />)
	}

	function SidebarOptions() {
		return (
			// <div id="sidebar-options" className={expanded ? "" : "sidebar-hidden"}>
			<div id="sidebar-options" style={{ display: expanded ? "flex" : "none" }}>
				<p>tools</p>
				<button className="sidebar-alg-button" onClick={handleHomeClick}>
					home
				</button>
				<button className="sidebar-alg-button" onClick={setColourScheme}>
					randomize colours
				</button>
				<button className="sidebar-alg-button" onClick={handleRandomAlgorithmClick}>
					random algorithm
				</button>
				<p>arrays</p>
				<button className="sidebar-alg-button" onClick={handleBinarySearchClick}>
					binary search
				</button>
				<button className="sidebar-alg-button" onClick={handleSelectionSortClick}>
					selection sort
				</button>
				<p>spanning trees</p>
				<p>shortest paths</p>
			</div>
		)
	}

	return (
		<div id="sidebar">
			<div id="sidebar-hamburger" onClick={handleExpandClick}>
				<div id="sidebar-hamburger-top" className="sidebar-hamburger-line" />
				<div id="sidebar-hamburger-middle" className="sidebar-hamburger-line" />
				<div id="sidebar-hamburger-bottom" className="sidebar-hamburger-line" />
			</div>
			<SidebarOptions />
		</div>
	)
}

export default Sidebar
