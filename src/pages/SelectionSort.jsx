import { useCallback, useEffect, useState } from "react"
import "../styles/SelectionSort.css"
import Box, { animatedMove } from "../components/Box"
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter"
import java from "react-syntax-highlighter/dist/cjs/languages/prism/java"
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism"

function generateArray(num) {
	let arr = []
	for (let i = 0; i < num; i++) {
		let num = Math.floor(Math.random() * 199) - 99
		// Ensure no duplicates so that React keys are unique
		while (arr.includes(num)) {
			num = Math.floor(Math.random() * 199) - 99
		}
		arr.push(num)
	}
	return arr
}

export class SelectionSortStateObject {
	constructor(array) {
		this.array = array

		this.index = 0
		this.finished = false
	}

	/**
	 * Swaps the numbers at indices a and b, modifies this object
	 * @param {Number} a the first index
	 * @param {Number} b the second index
	 */
	swap(a, b) {
		let temp = this.array[a]
		this.array[a] = this.array[b]
		this.array[b] = temp
	}

	/**
	 * Finds and returns the index of the minimum value from the unsorted portion of the array
	 * @returns the index of the minimum value from the unsorted portion of the array
	 */
	findMin() {
		let currentMinValue = this.array[this.index]
		let currentMinIndex = this.index
		for (let i = this.index + 1; i < this.array.length; i++) {
			if (this.array[i] < currentMinValue) {
				currentMinValue = this.array[i]
				currentMinIndex = i
			}
		}
		return currentMinIndex
	}

	/**
	 * Clones this object and advances its state if not already finished
	 * @returns a close of the current state, advanced one step if possible
	 */
	step() {
		// Return immediately if finished sorting
		if (this.finished) {
			return this
		}

		// Clone the current state
		let newObj = new SelectionSortStateObject(this.array)
		newObj.index = this.index

		// Find miminum value in the array
		let index = newObj.findMin()
		newObj.swap(newObj.index, index)
		newObj.index++
		if (newObj.index === newObj.array.length) {
			newObj.finished = true
		}
		return newObj
	}
}

/**
 * React functional component for the SelectionSort page
 * @returns the JSX of the component
 */
function SelectionSort() {
	const num = 9

	const [ssBoxWidth, setSsBoxWidth] = useState(0)
	const [animationPlaying, setAnimationPlaying] = useState(false)
	const [obj, setObj] = useState(new SelectionSortStateObject(generateArray(num)))

	SyntaxHighlighter.registerLanguage("java", java)

	function handleSortClick() {
		if (animationPlaying) {
			return
		}
		setAnimationPlaying(true)
	}

	function handleRandomizeClick() {
		if (animationPlaying) {
			return
		}
		setObj(new SelectionSortStateObject(generateArray(num)))
	}

	/**
	 * Create an event handler for window resize events
	 * Created with a callback hook because bxBoxWidth will change each resize
	 */
	const handleResize = useCallback(() => {
		let boxes = document.getElementById("ss-boxes")
		if (boxes === null) {
			return
		}
		let newWidth = boxes.clientWidth
		for (let i = 0; i < num; i++) {
			let boxWidth = document.getElementById("ss-b" + i).clientWidth
			let newPosition = (newWidth / (num + 1)) * (i + 1) - boxWidth / 2
			let oldPosition = (ssBoxWidth / (num + 1)) * (i + 1) - boxWidth / 2
			animatedMove("ss-b" + i, oldPosition + "px", "0px", newPosition + "px", "0px")
		}

		setSsBoxWidth(newWidth)
	}, [ssBoxWidth, num])

	// Setup window resize event listener
	useEffect(() => {
		window.addEventListener("resize", handleResize, { once: true })
		// Trigger the initial box animation and update the state
		handleResize()
	}, [handleResize, num])

	/**
	 * This function handles the finishing step of the animation. Extracted for consistency.
	 */
	const handleAnimationFinish = useCallback(() => {
		setAnimationPlaying(false)
		// Remove highlight from all boxes
		for (let i = 0; i < obj.array.length; i++) {
			document.getElementById("ss-b" + i).classList.remove("highlight")
		}
	}, [obj])

	/**
	 * This function handles stepping the animation. Extracted for consistency.
	 * @param {Number} idx the index to highlight
	 */
	const handleAnimationStep = useCallback(
		idx => {
			document.getElementById("ss-b" + idx).classList.add("highlight")
			setObj(obj.step())
		},
		[obj]
	)

	useEffect(() => {
		if (!animationPlaying) {
			handleResize()
			return
		}
		let minIndex = obj.findMin()
		if (minIndex === obj.index) {
			setTimeout(() => {
				if (obj.finished) {
					handleAnimationFinish()
				} else {
					handleAnimationStep(minIndex)
				}
			}, 500)
		} else {
			// Get left and right positions for the animation
			let boxWidth = document.getElementById("ss-b" + minIndex).clientWidth
			let rightPosition = (ssBoxWidth / (obj.array.length + 1)) * (minIndex + 1) - boxWidth / 2
			let leftPosition = (ssBoxWidth / (obj.array.length + 1)) * (obj.index + 1) - boxWidth / 2

			// Raise right box
			animatedMove("ss-b" + minIndex, rightPosition + "px", "0px", rightPosition + "px", "-56px")
			// Lower left box
			animatedMove("ss-b" + obj.index, leftPosition + "px", "0px", leftPosition + "px", "56px")

			setTimeout(() => {
				// Ensure both boxes are still present in the DOM before attempting to animate them
				let leftBox = document.getElementById("ss-b" + minIndex)
				let rightBox = document.getElementById("ss-b" + obj.index)
				if (leftBox === null || rightBox === null) {
					return
				}
				// Move right box to left box previous position
				animatedMove("ss-b" + minIndex, rightPosition + "px", "-56px", leftPosition + "px", "-56px")
				// Move left box to right box previous position
				animatedMove("ss-b" + obj.index, leftPosition + "px", "56px", rightPosition + "px", "56px")

				setTimeout(() => {
					// Ensure both boxes are still present in the DOM before attempting to animate them
					let leftBox = document.getElementById("ss-b" + minIndex)
					let rightBox = document.getElementById("ss-b" + obj.index)
					if (leftBox === null || rightBox === null) {
						return
					}
					// Lower (old) right box to its new position
					animatedMove("ss-b" + minIndex, leftPosition + "px", "-56px", leftPosition + "px", "0px")
					// Raise (old) left box to its new position
					animatedMove("ss-b" + obj.index, rightPosition + "px", "56px", rightPosition + "px", "0px")

					setTimeout(() => {
						if (obj.finished) {
							handleAnimationFinish()
						} else {
							handleAnimationStep(minIndex)
						}
					}, 500)
				}, 500)
			}, 500)
		}
	}, [animationPlaying, handleAnimationFinish, handleAnimationStep, handleResize, obj, ssBoxWidth])

	return (
		<div className="page">
			<div id="ss-box" className="fg-box">
				<p className="title-text">selection sort</p>
				<p className="title-description">O(n²) sorting algorithm</p>
				<div id="ss-buttons">
					<button className="ss-button button" onClick={handleSortClick}>
						SORT
					</button>
					<button className="ss-button button" onClick={handleRandomizeClick}>
						RANDOMIZE
					</button>
				</div>
				<div id="ss-boxes">
					{(() => {
						let boxes = []
						// Create a box for each number
						for (let i = 0; i < num; i++) {
							boxes.push(<Box text={obj.array[i]} id={"ss-b" + i} key={"ss-box" + obj.array[i]} />)
						}
						return boxes
					})()}
				</div>
			</div>
			<div className="extra">
				<div className="fg-box">
					<p className="extra-box-text">Steps</p>
					<div className="extra-box-children">
						<ol type="1">
							<li>
								Moving down the array from left to right, keep track of the current index and call it <code>i</code>.
							</li>
							<li>Do the following for every index in the array:</li>
							<ol type="a">
								<li>
									Find the index of the minimum value in the array between i and the end of the array, inclusive. Call this index <code>j</code>.
								</li>
								<li>
									Swap the elements in the array at indices <code>i</code> and <code>j</code>.
								</li>
							</ol>
							<li>Return the sorted array.</li>
						</ol>
					</div>
				</div>
				<div className="fg-box">
					<p className="extra-box-text">Code</p>
					<div className="extra-box-children">
						<SyntaxHighlighter language="java" style={tomorrow} showLineNumbers>
							{`// This function returns the index of the minimum value
// found in the given array of integers past startIndex.
private static int findMin(int[] array, int startIndex) {
    int minValue = array[startIndex];
    int minValueIndex = startIndex;
    for (int i = startIndex + 1; i < array.length; i++) {
        if (array[i] < minValue) {
            minValue = array[i];
            minValueIndex = i;
        }
    }
    return minValueIndex;
}

// This function swaps the values at indices a and b
// in the given array.
private static int[] swap(int[] array, int a, int b) {
    int temp = array[a];
    array[a] = array[b];
    array[b] = temp;
    return array;
}

// This function sorts the given array using the
// selection sort algorithm.
private static int[] selectionSort(int[] array) {
    for (int i = 0; i < array.length; i++) {
        int minIndex = findMin(array, i);
        array = swap(array, minIndex, i);
    }
    return array;
}`}
						</SyntaxHighlighter>
					</div>
				</div>
			</div>
		</div>
	)
}

export default SelectionSort
