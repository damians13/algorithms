import { useCallback, useEffect, useState } from "react"
import "../styles/InsertionSort.css"
import Box, { animatedMove } from "../components/Box"

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

export class InsertionSortStateObject {
	constructor(array) {
		this.array = array

		this.sortedUpToIndex = 0
		this.gapIndex = 0
		this.prevGapIndex = -1
		this.isPickedUp = false
		this.wasPickedUp = false
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
	 * Clones this object and advances its state if not already finished
	 * @returns a close of the current state, advanced one step if possible
	 */
	step() {
		if (this.finished) {
			return this
		}

		// Clone the current state
		let newObj = new InsertionSortStateObject(this.array)
		newObj.sortedUpToIndex = this.sortedUpToIndex
		newObj.gapIndex = this.gapIndex
		newObj.prevGapIndex = this.gapIndex // Not a typo
		newObj.isPickedUp = this.isPickedUp
		newObj.wasPickedUp = this.wasPickedUp

		if (!newObj.isPickedUp) {
			// Remember the fact that the element was not picked up for the animation
			newObj.wasPickedUp = false
			// Check if the element is in the correct position
			if (newObj.gapIndex === 0 || newObj.array[newObj.gapIndex] >= newObj.array[newObj.gapIndex - 1]) {
				// Prepare for next iteration (if not finished)
				newObj.sortedUpToIndex++
				newObj.gapIndex = newObj.sortedUpToIndex
				if (newObj.sortedUpToIndex === newObj.array.length) {
					newObj.finished = true
				}
			} else {
				// Element is not sorted, pick it up so we can move it and sort it on the next iteration
				newObj.isPickedUp = true
			}
		} else {
			// Remember the fact that the element was picked up for the animation
			newObj.wasPickedUp = true
			// Check if the element is in the correct position
			if (newObj.gapIndex === 0 || newObj.array[newObj.gapIndex] >= newObj.array[newObj.gapIndex - 1]) {
				// Put the element down
				newObj.isPickedUp = false
			} else {
				// Element is not sorted, swap it with the element to its left and decrement gapIndex
				newObj.swap(newObj.gapIndex, newObj.gapIndex - 1)
				newObj.gapIndex--
			}
		}
		return newObj
	}
}

function InsertionSort() {
	const num = 9

	const [isBoxWidth, setIsBoxWidth] = useState(0)
	const [animationPlaying, setAnimationPlaying] = useState(false)
	const [obj, setObj] = useState(new InsertionSortStateObject(generateArray(num)))

	function handleSortClick() {
		if (animationPlaying) {
			return
		}
		setObj(new InsertionSortStateObject(obj.array))
		setAnimationPlaying(true)
	}

	function handleRandomizeClick() {
		if (animationPlaying) {
			return
		}
		setObj(new InsertionSortStateObject(generateArray(num)))
	}

	/**
	 * Create an event handler for window resize events
	 * Created with a callback hook because bxBoxWidth will change each resize
	 */
	const handleResize = useCallback(() => {
		let boxes = document.getElementById("is-boxes")
		if (boxes === null) {
			return
		}
		let newWidth = boxes.clientWidth
		for (let i = 0; i < num; i++) {
			let boxWidth = document.getElementById("is-b" + i).clientWidth
			let newPosition = (newWidth / (num + 1)) * (i + 1) - boxWidth / 2
			let oldPosition = (isBoxWidth / (num + 1)) * (i + 1) - boxWidth / 2
			animatedMove("is-b" + i, oldPosition + "px", "0px", newPosition + "px", "0px")
		}

		setIsBoxWidth(newWidth)
	}, [isBoxWidth, num])

	// Setup window resize event listener
	useEffect(() => {
		window.addEventListener("resize", handleResize, { once: true })
		// Trigger the initial box animation and update the state
		handleResize()
	}, [handleResize, num])

	// Sorting animation
	useEffect(() => {
		if (!animationPlaying) {
			handleResize()
			return
		}

		let boxWidth = document.getElementById("is-b0").clientWidth
		let gapPosition = (isBoxWidth / (obj.array.length + 1)) * (obj.gapIndex + 1) - boxWidth / 2

		if (obj.isPickedUp && !obj.wasPickedUp) {
			// Animate the pick up step
			animatedMove("is-b" + obj.gapIndex, gapPosition + "px", "0px", gapPosition + "px", "-56px")
		} else if (!obj.isPickedUp && obj.wasPickedUp) {
			// Animate the put down step
			animatedMove("is-b" + obj.gapIndex, gapPosition + "px", "-56px", gapPosition + "px", "0px")
		} else if (obj.isPickedUp) {
			// Animate the swap step
			let swapPosition = (isBoxWidth / (obj.array.length + 1)) * (obj.gapIndex + 2) - boxWidth / 2

			animatedMove("is-b" + (obj.gapIndex + 1), gapPosition + "px", "0px", swapPosition + "px", "0px")
			animatedMove("is-b" + obj.gapIndex, swapPosition + "px", "-56px", gapPosition + "px", "-56px")
		}

		setTimeout(() => {
			if (obj.finished) {
				document.getElementById("is-b" + obj.prevGapIndex).classList.add("highlight")
				setTimeout(() => {
					setAnimationPlaying(false)
					// Remove highlight from all boxes
					for (let i = 0; i < obj.array.length; i++) {
						document.getElementById("is-b" + i).classList.remove("highlight")
					}
				}, 500)
			} else {
				console.log(obj.prevSortedIndex)
				if (obj.prevGapIndex >= 0 && obj.prevGapIndex < obj.gapIndex) {
					document.getElementById("is-b" + obj.prevGapIndex).classList.add("highlight")
				}
				setObj(obj.step())
			}
		}, 500)
	}, [animationPlaying, handleResize, isBoxWidth, obj])

	return (
		<div className="page">
			<div id="is-box" className="fg-box">
				<p className="title-text">insertion sort</p>
				<p className="title-description">O(n²) sorting algorithm</p>
				<div id="is-buttons">
					<button className="is-button button" onClick={handleSortClick}>
						SORT
					</button>
					<button className="is-button button" onClick={handleRandomizeClick}>
						RANDOMIZE
					</button>
				</div>
				<div id="is-boxes">
					{(() => {
						let boxes = []
						// Create a box for each number
						for (let i = 0; i < num; i++) {
							boxes.push(<Box text={obj.array[i]} id={"is-b" + i} key={"is-box" + obj.array[i]} />)
						}
						return boxes
					})()}
				</div>
			</div>
		</div>
	)
}

export default InsertionSort
