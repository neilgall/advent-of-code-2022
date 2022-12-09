import { 
    Direction,
    parseInput,
    part1,
    part2,
 } from "./solution";

const testInput = 
`R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`;

describe("parseInput", () => {
    it("parses the input", () => {
        expect(parseInput(testInput)).toStrictEqual([
            { direction: Direction.Right, steps: 4 },
            { direction: Direction.Up, steps: 4 },
            { direction: Direction.Left, steps: 3 },
            { direction: Direction.Down, steps: 1 },
            { direction: Direction.Right, steps: 4 },
            { direction: Direction.Down, steps: 1 },
            { direction: Direction.Left, steps: 5 },
            { direction: Direction.Right, steps: 2 },
        ]);
    });
});


describe("part1", () => {
    it("calculates the correct answer", () => {
        expect(part1(testInput)).toBe(0);
    });
});


describe("part2", () => {
    it("calculates the correct answer", () => {
        expect(part2(testInput)).toBe(0);
    });
});
