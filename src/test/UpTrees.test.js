import UpTrees from "../components/UpTrees"

describe("UpTrees simple tests", () => {
	let forest
	beforeEach(() => {
		forest = new UpTrees()
		forest.add(1)
		forest.add(2)
	})

	test("add", () => {
		expect(forest.forest.get(1)).toBe(-1)
		expect(forest.forest.get(2)).toBe(-1)
	})

	test("trivial find", () => {
		expect(forest.find(1)).toBe(1)
		expect(forest.find(2)).toBe(2)
	})

	test("simple union", () => {
		forest.union(1, 2)
		expect(forest.forest.get(1)).toBe(-2)
		expect(forest.forest.get(2)).toBe(1)
	})

	test("simple union and find", () => {
		forest.union(1, 2)
		expect(forest.find(1)).toBe(1)
		expect(forest.find(2)).toBe(1)
	})
})

describe("UpTrees more involved tests", () => {
	let forest
	beforeEach(() => {
		forest = new UpTrees()
		forest.add(0)
		forest.add(1)
		forest.add(2)
		forest.add(3)
		forest.add(4)
		forest.add(5)
		forest.add(6)
		forest.add(7)
	})

	test("more unions", () => {
		forest.union(2, 5)
		expect(forest.forest.get(2)).toBe(-2)
		expect(forest.forest.get(5)).toBe(2)
		forest.union(2, 6)
		expect(forest.forest.get(2)).toBe(-3)
		expect(forest.forest.get(6)).toBe(2)
	})

	test("smart union and path compression", () => {
		forest.union(2, 5)
		expect(forest.forest.get(2)).toBe(-2)
		expect(forest.forest.get(5)).toBe(2)
		forest.union(2, 6)
		expect(forest.forest.get(2)).toBe(-3)
		expect(forest.forest.get(6)).toBe(2)
		forest.union(5, 7)
		expect(forest.forest.get(2)).toBe(-4)
		expect(forest.forest.get(5)).toBe(2)
		expect(forest.forest.get(7)).toBe(2)
		forest.union(0, 7)
		expect(forest.forest.get(2)).toBe(-5)
		expect(forest.forest.get(5)).toBe(2)
		expect(forest.forest.get(7)).toBe(2)
		expect(forest.forest.get(0)).toBe(2)
	})

	test("manual find", () => {
		forest.forest.set(0, 7)
		forest.forest.set(2, -5)
		forest.forest.set(5, 2)
		forest.forest.set(6, 2)
		forest.forest.set(7, 2)

		expect(forest.find(0)).toBe(2)
		expect(forest.find(2)).toBe(2)
		expect(forest.find(5)).toBe(2)
		expect(forest.find(6)).toBe(2)
		expect(forest.find(7)).toBe(2)
	})

	test("many layered manual find", () => {
		forest.forest.set(0, 1)
		forest.forest.set(1, 2)
		forest.forest.set(2, 3)
		forest.forest.set(3, 4)
		forest.forest.set(4, 5)
		forest.forest.set(5, 6)
		forest.forest.set(6, 7)
		forest.forest.set(7, -8)

		expect(forest.find(0)).toBe(7)
		expect(forest.find(1)).toBe(7)
		expect(forest.find(2)).toBe(7)
		expect(forest.find(3)).toBe(7)
		expect(forest.find(4)).toBe(7)
		expect(forest.find(5)).toBe(7)
		expect(forest.find(6)).toBe(7)
		expect(forest.find(7)).toBe(7)
	})

	test("find after smart union and path compression", () => {
		forest.union(2, 5)
		expect(forest.find(5)).toBe(2)
		forest.union(2, 6)
		expect(forest.find(6)).toBe(2)
		forest.union(5, 7)
		expect(forest.find(7)).toBe(2)
		forest.union(0, 7)
		expect(forest.forest.get(0)).toBe(2)
	})

	test("significant smart union test", () => {
		forest.union(0, 1)
		forest.union(0, 3)
		forest.union(4, 5)
		forest.union(4, 6)
		forest.union(4, 7)

		expect(forest.find(0)).toBe(0)
		expect(forest.find(1)).toBe(0)
		expect(forest.find(2)).toBe(2)
		expect(forest.find(3)).toBe(0)
		expect(forest.find(4)).toBe(4)
		expect(forest.find(5)).toBe(4)
		expect(forest.find(6)).toBe(4)
		expect(forest.find(7)).toBe(4)

		forest.union(3, 7)

		expect(forest.find(0)).toBe(4)
		expect(forest.find(1)).toBe(4)
		expect(forest.find(2)).toBe(2)
		expect(forest.find(3)).toBe(4)
		expect(forest.find(4)).toBe(4)
		expect(forest.find(5)).toBe(4)
		expect(forest.find(6)).toBe(4)
		expect(forest.find(7)).toBe(4)

		forest.union(0, 2)

		expect(forest.find(0)).toBe(4)
		expect(forest.find(1)).toBe(4)
		expect(forest.find(2)).toBe(4)
		expect(forest.find(3)).toBe(4)
		expect(forest.find(4)).toBe(4)
		expect(forest.find(5)).toBe(4)
		expect(forest.find(6)).toBe(4)
		expect(forest.find(7)).toBe(4)
	})
})
