import { SelectionSortStateObject } from "../pages/SelectionSort"

test("swap edges", () => {
	let obj = new SelectionSortStateObject([0, 1, 2, 3, 4])
	obj.swap(0, 4)
	expect(obj.array).toStrictEqual([4, 1, 2, 3, 0])
})

test("swap same element", () => {
	let obj = new SelectionSortStateObject([0, 1, 2, 3, 4])
	obj.swap(3, 3)
	expect(obj.array).toStrictEqual([0, 1, 2, 3, 4])
})

test("findMin already sorted", () => {
	let obj = new SelectionSortStateObject([0, 1, 2, 3, 4])
	expect(obj.findMin()).toBe(0)
})

test("findMin already sorted, non-zero index", () => {
	let obj = new SelectionSortStateObject([0, 1, 2, 3, 4])
	obj.index = 2
	expect(obj.findMin()).toBe(2)
})

test("findMin unsorted", () => {
	let obj = new SelectionSortStateObject([3, 2, 1, 5, 0])
	expect(obj.findMin()).toBe(4)
})

test("findMin unsorted, non-zero index", () => {
	let obj = new SelectionSortStateObject([0, 1, 4, 2, 3])
	obj.index = 2
	expect(obj.findMin()).toBe(3)
})

test("step through full execution", () => {
	let obj = new SelectionSortStateObject([3, 1, 4, 0, 2])
	obj = obj.step()
	expect(obj.array).toStrictEqual([0, 1, 4, 3, 2])
	expect(obj.index).toBe(1)
	obj = obj.step()
	expect(obj.array).toStrictEqual([0, 1, 4, 3, 2])
	expect(obj.index).toBe(2)
	obj = obj.step()
	expect(obj.array).toStrictEqual([0, 1, 2, 3, 4])
	expect(obj.index).toBe(3)
	obj = obj.step()
	expect(obj.array).toStrictEqual([0, 1, 2, 3, 4])
	expect(obj.index).toBe(4)
	expect(obj.finished).toBe(false)
	obj = obj.step()
	expect(obj.array).toStrictEqual([0, 1, 2, 3, 4])
	expect(obj.index).toBe(5)
	expect(obj.finished).toBe(true)
})
