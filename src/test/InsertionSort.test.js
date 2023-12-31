import { InsertionSortStateObject } from "../pages/InsertionSort"

test("swap edges", () => {
	let obj = new InsertionSortStateObject([0, 1, 2, 3, 4])
	obj.swap(0, 4)
	expect(obj.array).toStrictEqual([4, 1, 2, 3, 0])
})

test("swap same element", () => {
	let obj = new InsertionSortStateObject([0, 1, 2, 3, 4])
	obj.swap(3, 3)
	expect(obj.array).toStrictEqual([0, 1, 2, 3, 4])
})

test("step through full execution", () => {
	let obj = new InsertionSortStateObject([3, 1, 4, 0, 2])
	obj = obj.step()
	expect(obj.isPickedUp).toBe(false)
	expect(obj.wasPickedUp).toBe(false)
	expect(obj.sortedUpToIndex).toBe(1)
	expect(obj.gapIndex).toBe(1)
	expect(obj.prevGapIndex).toBe(0)
	expect(obj.array).toStrictEqual([3, 1, 4, 0, 2])
	obj = obj.step()
	expect(obj.isPickedUp).toBe(true)
	expect(obj.wasPickedUp).toBe(false)
	expect(obj.sortedUpToIndex).toBe(1)
	expect(obj.gapIndex).toBe(1)
	expect(obj.prevGapIndex).toBe(1)
	expect(obj.array).toStrictEqual([3, 1, 4, 0, 2])
	obj = obj.step()
	expect(obj.isPickedUp).toBe(true)
	expect(obj.wasPickedUp).toBe(true)
	expect(obj.sortedUpToIndex).toBe(1)
	expect(obj.gapIndex).toBe(0)
	expect(obj.prevGapIndex).toBe(1)
	expect(obj.array).toStrictEqual([1, 3, 4, 0, 2])
	obj = obj.step()
	expect(obj.isPickedUp).toBe(false)
	expect(obj.wasPickedUp).toBe(true)
	expect(obj.sortedUpToIndex).toBe(1)
	expect(obj.gapIndex).toBe(0)
	expect(obj.prevGapIndex).toBe(0)
	expect(obj.array).toStrictEqual([1, 3, 4, 0, 2])
	obj = obj.step()
	expect(obj.isPickedUp).toBe(false)
	expect(obj.wasPickedUp).toBe(false)
	expect(obj.sortedUpToIndex).toBe(2)
	expect(obj.gapIndex).toBe(2)
	expect(obj.prevGapIndex).toBe(0)
	expect(obj.array).toStrictEqual([1, 3, 4, 0, 2])
	obj = obj.step()
	expect(obj.isPickedUp).toBe(false)
	expect(obj.wasPickedUp).toBe(false)
	expect(obj.sortedUpToIndex).toBe(3)
	expect(obj.gapIndex).toBe(3)
	expect(obj.prevGapIndex).toBe(2)
	expect(obj.array).toStrictEqual([1, 3, 4, 0, 2])
	obj = obj.step()
	expect(obj.isPickedUp).toBe(true)
	expect(obj.wasPickedUp).toBe(false)
	expect(obj.sortedUpToIndex).toBe(3)
	expect(obj.gapIndex).toBe(3)
	expect(obj.prevGapIndex).toBe(3)
	expect(obj.array).toStrictEqual([1, 3, 4, 0, 2])
	obj = obj.step()
	expect(obj.isPickedUp).toBe(true)
	expect(obj.wasPickedUp).toBe(true)
	expect(obj.sortedUpToIndex).toBe(3)
	expect(obj.gapIndex).toBe(2)
	expect(obj.prevGapIndex).toBe(3)
	expect(obj.array).toStrictEqual([1, 3, 0, 4, 2])
	obj = obj.step()
	expect(obj.isPickedUp).toBe(true)
	expect(obj.wasPickedUp).toBe(true)
	expect(obj.sortedUpToIndex).toBe(3)
	expect(obj.gapIndex).toBe(1)
	expect(obj.prevGapIndex).toBe(2)
	expect(obj.array).toStrictEqual([1, 0, 3, 4, 2])
	obj = obj.step()
	expect(obj.isPickedUp).toBe(true)
	expect(obj.wasPickedUp).toBe(true)
	expect(obj.sortedUpToIndex).toBe(3)
	expect(obj.gapIndex).toBe(0)
	expect(obj.prevGapIndex).toBe(1)
	expect(obj.array).toStrictEqual([0, 1, 3, 4, 2])
	obj = obj.step()
	expect(obj.isPickedUp).toBe(false)
	expect(obj.wasPickedUp).toBe(true)
	expect(obj.sortedUpToIndex).toBe(3)
	expect(obj.gapIndex).toBe(0)
	expect(obj.prevGapIndex).toBe(0)
	expect(obj.array).toStrictEqual([0, 1, 3, 4, 2])
	obj = obj.step()
	expect(obj.isPickedUp).toBe(false)
	expect(obj.wasPickedUp).toBe(false)
	expect(obj.sortedUpToIndex).toBe(4)
	expect(obj.gapIndex).toBe(4)
	expect(obj.prevGapIndex).toBe(0)
	expect(obj.array).toStrictEqual([0, 1, 3, 4, 2])
	obj = obj.step()
	expect(obj.isPickedUp).toBe(true)
	expect(obj.wasPickedUp).toBe(false)
	expect(obj.sortedUpToIndex).toBe(4)
	expect(obj.gapIndex).toBe(4)
	expect(obj.prevGapIndex).toBe(4)
	expect(obj.array).toStrictEqual([0, 1, 3, 4, 2])
	obj = obj.step()
	expect(obj.isPickedUp).toBe(true)
	expect(obj.wasPickedUp).toBe(true)
	expect(obj.sortedUpToIndex).toBe(4)
	expect(obj.gapIndex).toBe(3)
	expect(obj.prevGapIndex).toBe(4)
	expect(obj.array).toStrictEqual([0, 1, 3, 2, 4])
	obj = obj.step()
	expect(obj.isPickedUp).toBe(true)
	expect(obj.wasPickedUp).toBe(true)
	expect(obj.sortedUpToIndex).toBe(4)
	expect(obj.gapIndex).toBe(2)
	expect(obj.prevGapIndex).toBe(3)
	expect(obj.array).toStrictEqual([0, 1, 2, 3, 4])
	obj = obj.step()
	expect(obj.isPickedUp).toBe(false)
	expect(obj.wasPickedUp).toBe(true)
	expect(obj.sortedUpToIndex).toBe(4)
	expect(obj.gapIndex).toBe(2)
	expect(obj.prevGapIndex).toBe(2)
	expect(obj.array).toStrictEqual([0, 1, 2, 3, 4])
	expect(obj.finished).toBe(false)
	obj = obj.step()
	expect(obj.isPickedUp).toBe(false)
	expect(obj.wasPickedUp).toBe(false)
	expect(obj.sortedUpToIndex).toBe(5)
	expect(obj.gapIndex).toBe(5)
	expect(obj.prevGapIndex).toBe(2)
	expect(obj.array).toStrictEqual([0, 1, 2, 3, 4])
	expect(obj.finished).toBe(true)
})
