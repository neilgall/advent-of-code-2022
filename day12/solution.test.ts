import { 
    parseInput,
    part1,
    part2,
 } from "./solution";

const testInput = 
`Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;

describe("parseInput", () => {
    it("parses the input", () => {
        expect(parseInput(testInput)).toStrictEqual({
            cells: [
                [0, 0, 1, 16, 15, 14, 13, 12],
                [0, 1, 2, 17, 24, 23, 23, 11],
                [0, 2, 2, 18, 25, 25, 23, 10],
                [0, 2, 2, 19, 20, 21, 22, 9],
                [0, 1, 3, 4, 5, 6, 7, 8]
            ],
            start: { x: 0, y: 0 },
            target: { x: 5, y: 2 },
        });
    });
});

describe("part1", () => {
    it("calculates the correct answer", () => {
        expect(part1(testInput)).toBe(31);
    });
});


describe("part2", () => {
    it("calculates the correct answer", () => {
        expect(part2(testInput)).toBe(0);
    });
});
