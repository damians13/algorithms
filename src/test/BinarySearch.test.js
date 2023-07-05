import { BinarySearchStateObject } from "../pages/BinarySearch"

test("step with odd length array", () => {
	let obj = new BinarySearchStateObject([0, 1, 2, 3, 4], 1)

	obj = obj.step()
	expect(obj.left).toBe(0)
	expect(obj.mid).toBe(1)
	expect(obj.right).toBe(2)
	expect(obj.finished).toBe(false)

	obj = obj.step()
	expect(obj.left).toBe(0)
	expect(obj.mid).toBe(1)
	expect(obj.right).toBe(2)
	expect(obj.finished).toBe(true)
})

test("step with odd length array, first element", () => {
	let obj = new BinarySearchStateObject([0, 1, 2, 3, 4], 0)

	obj = obj.step()
	expect(obj.left).toBe(0)
	expect(obj.mid).toBe(1)
	expect(obj.right).toBe(2)

	obj = obj.step()
	expect(obj.left).toBe(0)
	expect(obj.mid).toBe(0)
	expect(obj.right).toBe(1)
	expect(obj.finished).toBe(false)

	obj = obj.step()
	expect(obj.left).toBe(0)
	expect(obj.mid).toBe(0)
	expect(obj.right).toBe(1)
	expect(obj.finished).toBe(true)
	expect(obj.found).toBe(true)
})

test("step with odd length array, last element", () => {
	let obj = new BinarySearchStateObject([0, 1, 2, 3, 4], 4)

	obj = obj.step()
	expect(obj.left).toBe(2)
	expect(obj.mid).toBe(3)
	expect(obj.right).toBe(5)

	obj = obj.step()
	expect(obj.left).toBe(3)
	expect(obj.mid).toBe(4)
	expect(obj.right).toBe(5)
	expect(obj.finished).toBe(false)

	obj = obj.step()
	expect(obj.left).toBe(3)
	expect(obj.mid).toBe(4)
	expect(obj.right).toBe(5)
	expect(obj.finished).toBe(true)
	expect(obj.found).toBe(true)
})

test("step with odd length array, not found, left moving", () => {
	let obj = new BinarySearchStateObject([0, 1, 2, 3, 4], 5)

	obj = obj.step()
	expect(obj.left).toBe(2)
	expect(obj.mid).toBe(3)
	expect(obj.right).toBe(5)

	obj = obj.step()
	expect(obj.left).toBe(3)
	expect(obj.mid).toBe(4)
	expect(obj.right).toBe(5)

	obj = obj.step()
	expect(obj.left).toBe(4)
	expect(obj.mid).toBe(4)
	expect(obj.right).toBe(5)
	expect(obj.finished).toBe(false)

	obj = obj.step()
	expect(obj.left).toBe(4)
	expect(obj.mid).toBe(4)
	expect(obj.right).toBe(5)
	expect(obj.finished).toBe(true)
	expect(obj.found).toBe(false)
})

test("step with odd length array, not found, right moving", () => {
	let obj = new BinarySearchStateObject([0, 1, 2, 3, 4], -1)

	obj = obj.step()
	expect(obj.left).toBe(0)
	expect(obj.mid).toBe(1)
	expect(obj.right).toBe(2)

	obj = obj.step()
	expect(obj.left).toBe(0)
	expect(obj.mid).toBe(0)
	expect(obj.right).toBe(1)

	obj = obj.step()
	expect(obj.left).toBe(0)
	expect(obj.mid).toBe(0)
	expect(obj.right).toBe(0)
	expect(obj.finished).toBe(false)

	obj = obj.step()
	expect(obj.left).toBe(0)
	expect(obj.mid).toBe(0)
	expect(obj.right).toBe(0)
	expect(obj.finished).toBe(true)
	expect(obj.found).toBe(false)
})

test("step with even length array", () => {
	let obj = new BinarySearchStateObject([0, 1, 2, 3, 4, 5], 1)

	obj = obj.step()
	expect(obj.left).toBe(0)
	expect(obj.mid).toBe(1)
	expect(obj.right).toBe(3)
	expect(obj.finished).toBe(false)

	obj = obj.step()
	expect(obj.left).toBe(0)
	expect(obj.mid).toBe(1)
	expect(obj.right).toBe(3)
	expect(obj.finished).toBe(true)
	expect(obj.found).toBe(true)
})

test("step with even length array, first element", () => {
	let obj = new BinarySearchStateObject([0, 1, 2, 3, 4, 5], 0)

	obj = obj.step()
	expect(obj.left).toBe(0)
	expect(obj.mid).toBe(1)
	expect(obj.right).toBe(3)

	obj = obj.step()
	expect(obj.left).toBe(0)
	expect(obj.mid).toBe(0)
	expect(obj.right).toBe(1)
	expect(obj.finished).toBe(false)

	obj = obj.step()
	expect(obj.left).toBe(0)
	expect(obj.mid).toBe(0)
	expect(obj.right).toBe(1)
	expect(obj.finished).toBe(true)
	expect(obj.found).toBe(true)
})

test("step with even length array, last element", () => {
	let obj = new BinarySearchStateObject([0, 1, 2, 3, 4, 5], 5)

	obj = obj.step()
	expect(obj.left).toBe(3)
	expect(obj.mid).toBe(4)
	expect(obj.right).toBe(6)

	obj = obj.step()
	expect(obj.left).toBe(4)
	expect(obj.mid).toBe(5)
	expect(obj.right).toBe(6)
	expect(obj.finished).toBe(false)

	obj = obj.step()
	expect(obj.left).toBe(4)
	expect(obj.mid).toBe(5)
	expect(obj.right).toBe(6)
	expect(obj.finished).toBe(true)
	expect(obj.found).toBe(true)
})

test("step with even length array, not found, left moving", () => {
	let obj = new BinarySearchStateObject([0, 1, 2, 3, 4, 5], 6)

	obj = obj.step()
	expect(obj.left).toBe(3)
	expect(obj.mid).toBe(4)
	expect(obj.right).toBe(6)

	obj = obj.step()
	expect(obj.left).toBe(4)
	expect(obj.mid).toBe(5)
	expect(obj.right).toBe(6)

	obj = obj.step()
	expect(obj.left).toBe(5)
	expect(obj.mid).toBe(5)
	expect(obj.right).toBe(6)
	expect(obj.finished).toBe(false)

	obj = obj.step()
	expect(obj.left).toBe(5)
	expect(obj.mid).toBe(5)
	expect(obj.right).toBe(6)
	expect(obj.finished).toBe(true)
	expect(obj.found).toBe(false)
})

test("step with even length array, not found, right moving", () => {
	let obj = new BinarySearchStateObject([0, 1, 2, 3, 4, 5], -1)

	obj = obj.step()
	expect(obj.left).toBe(0)
	expect(obj.mid).toBe(1)
	expect(obj.right).toBe(3)

	obj = obj.step()
	expect(obj.left).toBe(0)
	expect(obj.mid).toBe(0)
	expect(obj.right).toBe(1)

	obj = obj.step()
	expect(obj.left).toBe(0)
	expect(obj.mid).toBe(0)
	expect(obj.right).toBe(0)
	expect(obj.finished).toBe(false)

	obj = obj.step()
	expect(obj.left).toBe(0)
	expect(obj.mid).toBe(0)
	expect(obj.right).toBe(0)
	expect(obj.finished).toBe(true)
	expect(obj.found).toBe(false)
})
