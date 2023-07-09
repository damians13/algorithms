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
		this.oldLeftX = -1
		this.oldMidX = -1
		this.oldRightX = -1
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
 * @returns the JSX of the component
 */
function BinarySearch() {
	const numBoxes = 9
	const inputRegex = /^-?\d*$/

	SyntaxHighlighter.registerLanguage("java", java)

	// Initialize state
	const [nums, setNums] = useState(generateSortedArray(numBoxes))

	const initialTarget = nums[Math.floor(Math.random() * numBoxes)]

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

	function handleRandomizeClick() {
		if (animationPlaying) {
			return
		}
		// Remove highlight from the animation if applicable
		if (obj.found) {
			document.getElementById("bs-b" + obj.mid).classList.remove("highlight")
		}

		// Randomize the numbers shown in the array
		let newNums = generateSortedArray(numBoxes)
		setNums(newNums)
		setInputText(newNums[Math.floor(Math.random() * numBoxes)])
	}

	// Reset search state whenever the nums array changes
	useEffect(() => {
		setObj(new BinarySearchStateObject(nums))
	}, [nums])

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
		let boxes = document.getElementById("bs-boxes")
		if (boxes === null) {
			return
		}
		let newWidth = boxes.clientWidth
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

		// Only run the animation on initial load or when positions have changed
		if (obj.oldLeftX !== leftPosition || obj.oldMidX !== midPosition || obj.oldRightX !== rightPosition) {
			// Ensure that the arrows stay on screen
			if (obj.oldLeftX < 0) {
				obj.oldLeftX = leftPosition
			}
			if (obj.oldMidX < 0) {
				obj.oldMidX = midPosition
			}
			if (obj.oldRightX < 0) {
				obj.oldRightX = rightPosition
			}

			// Prevents the arrows moving off screen on initial load when the positions are negative
			if (leftPosition >= 0) {
				animatedMove("left-arrow", obj.oldLeftX + "px", "-60px", leftPosition + "px", "-60px")
			}
			if (midPosition >= 0) {
				animatedMove("mid-arrow", obj.oldMidX + "px", "-60px", midPosition + "px", "-60px")
			}
			if (rightPosition >= 0) {
				animatedMove("right-arrow", obj.oldRightX + "px", "-60px", rightPosition + "px", "-60px")
			}
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
					<button id="bs-randomize" className="button" onClick={handleRandomizeClick}>
						RANDOMIZE
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
			<div className="extra">
				<div className="fg-box">
					<p className="extra-box-text">Steps</p>
					<div className="extra-box-children">
						<ol type="1">
							<li>
								Start a <code>left</code> pointer at the beginning of the array, and start a <code>right</code> pointer past the end of the array.
							</li>
							<li>
								While <code>left</code> and <code>right</code> are pointing to different entries (ie. <code>left != right</code>), do the following:
								<ol type="a">
									<li>
										Calculate the midpoint (arithmetic mean, rounded down) between <code>left</code> and <code>right</code>, call it <code>mid</code>.
									</li>
									<li>
										If the value at <code>mid</code> is the target value, return <code>mid</code>.
									</li>
									<li>
										If the value at <code>mid</code> is less than the target value, set <code>right</code> equal to <code>mid</code> and go to step 2.
									</li>
									<li>
										If the value at <code>mid</code> is greater than the target value, set <code>left</code> equal to <code>mid</code> and go to step 2.
									</li>
								</ol>
							</li>
							<li>If no value has been returned after the loop has run, then the target value does not appear in the array.</li>
						</ol>
					</div>
				</div>
				<div className="fg-box">
					<p className="extra-box-text">Code</p>
					<div className="extra-box-children">
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
