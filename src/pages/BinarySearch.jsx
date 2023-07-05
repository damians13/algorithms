import { useCallback, useEffect, useState } from "react"
import "../styles/BinarySearch.css"
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter"
import java from "react-syntax-highlighter/dist/cjs/languages/prism/java"
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism"
import Box, { animatedMove } from "../components/Box"
import DownArrow from "../components/DownArrow"
import UpArrow from "../components/UpArrow"

/**
 * This class represents the state of the binary search algorithm and supports the associated animations
 */
export class BinarySearchStateObject {
	constructor(array, target) {
		this.array = array
		this.target = target

		// Initialize search state variables
		this.left = 0
		this.mid = Math.floor(array.length / 2)
		this.right = array.length
		this.finished = false
		this.found = false

		// Store previous x coordinates of the arrows used in the animations
		this.oldLeftX = NaN
		this.oldMidX = NaN
		this.oldRightX = NaN
	}

	/**
	 * This function clones and advances the current state of the BinarySearchStateObject
	 * @returns A clone of the current state, advanced one step if possible
	 */
	step() {
		// Return immediately if the search is finished
		if (this.finished) {
			return this
		} else if (this.left === this.right) {
			this.finished = true
			return this
		}

		// Clone the current state
		let newObj = new BinarySearchStateObject(this.array, this.target)
		newObj.left = this.left
		newObj.mid = this.mid
		newObj.right = this.right
		newObj.oldLeftX = this.oldLeftX
		newObj.oldMidX = this.oldMidX
		newObj.oldRightX = this.oldRightX

		// Determine the next appropriate step for the search algorithm
		if (newObj.array[newObj.mid] < newObj.target) {
			if (newObj.left === newObj.mid) {
				newObj.finished = true
			}
			newObj.left = newObj.mid
		} else if (newObj.array[newObj.mid] > newObj.target) {
			if (newObj.right === newObj.mid) {
				newObj.finished = true
			}
			newObj.right = newObj.mid
		} else {
			newObj.finished = true
			if (newObj.array[newObj.mid] === newObj.target) {
				newObj.found = true
			}
		}

		newObj.mid = Math.floor((newObj.left + newObj.right) / 2)

		return newObj
	}
}

/**
 * This function generates an array of `numBoxes` sorted integers in the range [-99, 99]
 * @param {number} numBoxes the desired length of the generated array
 * @returns the generated array
 */
export function generateSortedArray(numBoxes) {
	// Generate random numbers and sort them
	let nums = []
	for (let i = 0; i < numBoxes; i++) {
		nums.push(Math.floor(Math.random() * 199) - 99)
	}
	nums.sort((a, b) => a - b)
	return nums
}

/**
 * React functional component for the BinarySearch page
 * @param {number[]} nums the sorted array of numbers to be used in the search algorithm
 * @returns the JSX of the component
 */
function BinarySearch({ nums }) {
	const numBoxes = nums.length
	const inputRegex = /^-?\d*$/
	const initialTarget = nums[Math.floor(Math.random() * numBoxes)]

	SyntaxHighlighter.registerLanguage("java", java)

	// Initialize state
	const [inputText, setInputText] = useState("" + initialTarget)
	const [obj, setObj] = useState(new BinarySearchStateObject(nums, initialTarget))
	const [animationPlaying, setAnimationPlaying] = useState(false)
	const [bsBoxWidth, setBsBoxWidth] = useState(0)

	function handleInputClick() {
		// Get user input and make sure it's valid
		let num = parseInt(inputText)
		if (isNaN(num) || animationPlaying) {
			return
		}

		// Remove highlight from the animation if applicable
		if (obj.found) {
			document.getElementById("bs-b" + obj.mid).classList.remove("highlight")
		}

		// Start new search animation with a state update
		setAnimationPlaying(true)
		setObj(new BinarySearchStateObject(nums, num))
	}

	/**
	 * Event handler for keyDown on the input element, used to ensure that only numbers can be used as input
	 * @param {KeyboardEvent} e the keyboard event
	 */
	function handleInputKeyDown(e) {
		let portionBeforeSelect = inputText.substring(0, e.target.selectionStart)
		let portionAfterSelect = inputText.substring(e.target.selectionEnd, inputText.length)
		let newText = ""
		if (e.nativeEvent.key === "Backspace") {
			if (e.target.selectionEnd - e.target.selectionStart === 0) {
				portionBeforeSelect = inputText.substring(0, e.target.selectionStart - 1)
			}
			newText = portionBeforeSelect + portionAfterSelect
			setInputText(newText)
		} else if (e.nativeEvent.key === "Delete") {
			if (e.target.selectionEnd - e.target.selectionStart === 0) {
				portionAfterSelect = inputText.substring(e.target.selectionEnd + 1, inputText.length)
			}
			newText = portionBeforeSelect + portionAfterSelect
			setInputText(newText)
		} else if (e.nativeEvent.key === "Enter") {
			handleInputClick()
		} else {
			newText = portionBeforeSelect + e.nativeEvent.key + portionAfterSelect
			if (inputRegex.test(newText)) {
				setInputText(newText)
			}
		}
	}

	/**
	 * Plays the "not found" animation on the search bar:
	 * Shakes and flashes colour on the input box when that value could not be found in the array
	 */
	function playNotFoundAnimation() {
		let inputBox = document.getElementById("bs-search-input")
		inputBox.animate(
			[
				{
					transform: "rotate(0deg)",
					backgroundColor: "#1e1e1e",
					offset: 0,
				},
				{
					transform: "rotate(3deg)",
					offset: 0.125,
				},
				{
					transform: "rotate(-5deg)",
					offset: 0.375,
				},
				{
					backgroundColor: "var(--mid)",
					offset: 0.5,
				},
				{
					transform: "rotate(5deg)",
					offset: 0.625,
				},
				{
					transform: "rotate(-3deg)",
					offset: 0.875,
				},
				{
					transform: "rotate(0deg)",
					backgroundColor: "#1e1e1e",
					offset: 1,
				},
			],
			{
				fill: "forwards",
				easing: "cubic-bezier(0,.95,.1,.98)",
				duration: 1000,
			}
		)
	}

	/**
	 * Create an event handler for window resize events
	 * Created with a callback hook because bxBoxWidth will change each resize
	 */
	const handleResize = useCallback(() => {
		let newWidth = document.getElementById("bs-boxes").clientWidth
		for (let i = 0; i < numBoxes; i++) {
			let boxWidth = document.getElementById("bs-b" + i).clientWidth
			let newPosition = (newWidth / (numBoxes + 1)) * (i + 1) - boxWidth / 2
			let oldPosition = (bsBoxWidth / (numBoxes + 1)) * (i + 1) - boxWidth / 2
			animatedMove("bs-b" + i, oldPosition + "px", "0px", newPosition + "px", "0px")
		}
		setBsBoxWidth(newWidth)
	}, [bsBoxWidth, numBoxes])

	// Setup window resize event listener
	useEffect(() => {
		window.addEventListener("resize", handleResize, { once: true })
		// Trigger the initial box animation and update the state
		handleResize()
	}, [handleResize, numBoxes])

	// Setup / animations for arrows
	useEffect(() => {
		let totalWidth = bsBoxWidth
		let arrowEdgeDistance = (totalWidth / numBoxes) * 0.25

		let leftWidth = document.getElementById("left-arrow").clientWidth
		let midWidth = document.getElementById("mid-arrow").clientWidth
		let rightWidth = document.getElementById("right-arrow").clientWidth

		let leftPosition = (totalWidth / (numBoxes + 1)) * (obj.left + 1) - leftWidth / 2
		let midPosition = (totalWidth / (numBoxes + 1)) * (obj.mid + 1) - midWidth / 2
		// Using Math.min to prevent the right arrow from going off the page
		let rightPosition = Math.min((totalWidth / (numBoxes + 1)) * (obj.right + 1) - rightWidth / 2, totalWidth - arrowEdgeDistance - rightWidth / 2)

		// Only run the animation when positions have changed
		if (obj.oldLeftX !== leftPosition || obj.oldMidX !== midPosition || obj.oldRightX !== rightPosition) {
			animatedMove("left-arrow", obj.oldLeftX + "px", "-60px", leftPosition + "px", "-60px")
			animatedMove("mid-arrow", obj.oldMidX + "px", "-60px", midPosition + "px", "-60px")
			animatedMove("right-arrow", obj.oldRightX + "px", "-60px", rightPosition + "px", "-60px")
		}

		obj.oldLeftX = leftPosition
		obj.oldMidX = midPosition
		obj.oldRightX = rightPosition

		if (animationPlaying) {
			if (!obj.finished) {
				setTimeout(() => {
					setObj(obj.step())
				}, 1000)
			} else {
				if (obj.found) {
					document.getElementById("bs-b" + obj.mid).classList.add("highlight")
				} else {
					playNotFoundAnimation()
				}
				setAnimationPlaying(false)
			}
		}
	}, [animationPlaying, bsBoxWidth, numBoxes, obj])

	return (
		<div className="page">
			<div id="bs-box" className="fg-box">
				<p className="title-text">binary search</p>
				<p className="title-description">search algorithm for sorted arrays</p>
				<div id="bs-search">
					<p>Search for:</p>
					<input id="bs-search-input" value={inputText} onKeyDown={handleInputKeyDown} onChange={() => {}} />
					<button id="bs-search-button" className="button" onClick={handleInputClick}>
						GO
					</button>
				</div>
				<DownArrow id="left-arrow" text="Left" />
				<DownArrow id="right-arrow" text="Right" />
				<div id="bs-boxes">
					{(() => {
						// Create a box for each number
						let boxes = []
						for (let i = 0; i < numBoxes; i++) {
							boxes.push(<Box text={nums[i]} id={"bs-b" + i} key={"bs-box" + i} />)
						}
						return boxes
					})()}
				</div>
				<UpArrow id="mid-arrow" text="Mid" />
			</div>
			<div id="bs-extra">
				<div id="bs-steps-box" className="fg-box">
					<p className="bs-extra-box-text">Steps</p>
					<div className="bs-extra-box-children">
						<ol type="1">
							<li>Start a “left” pointer at the beginning of the array, and start a “right” pointer past the end of the array.</li>
							<li>
								While “left” and “right” are pointing to different entries (ie. left != right), do the following:
								<ol type="a">
									<li>Calculate the midpoint (arithmetic mean, rounded down) between “left” and “right”, call it “mid”.</li>
									<li>If the value at “mid” is the target value, return “mid”.</li>
									<li>If the value at “mid” is less than the target value, set “right” equal to “mid” and go to step 2.</li>
									<li>If the value at “mid” is greater than the target value, set “left” equal to “mid” and go to step 2.</li>
								</ol>
							</li>
							<li>If no value has been returned after the loop has run, then the target value does not appear in the array.</li>
						</ol>
					</div>
				</div>
				<div id="bs-code-box" className="fg-box">
					<p className="bs-extra-box-text">Code</p>
					<div className="bs-extra-box-children">
						<SyntaxHighlighter language="java" style={tomorrow} showLineNumbers>
							{`private int binarySearch(int[] array, int target) {
	int left = 0;
	int right = array.length;
	while (left != right) {
		int mid = (left + right) / 2;
		if (arr[mid] < target) {
			left = mid;
		} else if (arr[mid] > target) {
			right = mid;
		} else {
			if (arr[mid] == target) {
				return mid; // Success!
			} else {
				return -1; // Target not in array
			}
		}
	}
}`}
						</SyntaxHighlighter>
					</div>
				</div>
			</div>
		</div>
	)
}

export default BinarySearch
