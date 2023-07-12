import React, { useEffect, useState } from "react"
import "../styles/Sidebar.css"
import { Link, useNavigate } from "react-router-dom"

function Sidebar({ random, setColourScheme }) {
	const [expanded, setExpanded] = useState(true)
	const navigate = useNavigate()

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

	function handleRandomAlgorithmClick() {
		navigate(random())
	}

	function SidebarOptions() {
		return (
			<div id="sidebar-options" style={{ display: expanded ? "flex" : "none" }}>
				<p>tools</p>
				<Link to="/" className="sidebar-alg-button">
					home
				</Link>
				<button className="sidebar-alg-button" onClick={setColourScheme}>
					randomize colours
				</button>
				<button className="sidebar-alg-button" onClick={handleRandomAlgorithmClick}>
					random algorithm
				</button>
				<p>arrays</p>
				<Link to="/binary-search" className="sidebar-alg-button">
					binary search
				</Link>
				<Link to="/insertion-sort" className="sidebar-alg-button">
					insertion sort
				</Link>
				<Link to="/selection-sort" className="sidebar-alg-button">
					selection sort
				</Link>
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
