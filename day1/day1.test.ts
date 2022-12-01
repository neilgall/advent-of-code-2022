import { parseInput, part1, part2 } from "./day1";

describe("parser", () => {
    it("reads the test data", () => {
        const elves = parseInput(
`1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`);
        expect(elves).toStrictEqual([6000, 4000, 11000, 24000, 10000]);
    });
});


describe("problems", () => {
    const elves = [6000, 4000, 11000, 24000, 10000];

    it("part1", () => {
        expect(part1(elves)).toBe(24000);
    });

    it("part2", () => {
        expect(part2(elves)).toBe(45000);
    });
});
