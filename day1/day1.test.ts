import { parse_input, part1 } from "./day1";

describe("parser", () => {
    it("reads the test data", () => {
        const elves = parse_input(
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


describe("part1", () => {
    it("calculates the right answer", () => {
        const elves = [6000, 4000, 11000, 24000, 10000];
        expect(part1(elves)).toBe(24000);
    });
});