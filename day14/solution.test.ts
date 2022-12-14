import { 
    buildCave,
    makeBoundedCave,
    parseInput,
    part1,
    part2,
    Tile,
 } from "./solution";

const testInput = 
`498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9
`;

describe("parseInput", () => {
    it("parses the input", () => {
        expect(parseInput(testInput)).toStrictEqual([
            [{ x: 498, y: 4 }, { x: 498, y: 6 }, { x: 496, y: 6 }],
            [{ x: 503, y: 4 }, { x: 502, y: 4 }, { x: 502, y: 9 }, { x: 494, y: 9 }]
        ]);
    });
});


describe("makeBoundedCave", () => {
    it("draws the rock structure", () => {
        const cave = makeBoundedCave(parseInput(testInput));
        const draw = Array.from(cave.map.render((t) => 
            [".", "#", "+", "o"][t]
        ));
        expect(draw).toStrictEqual([
            "......+...",
            "..........",
            "..........",
            "..........",
            "....#...##",
            "....#...#.",
            "..###...#.",
            "........#.",
            "........#.",
            "#########.",
        ]);
    });
});

describe("part1", () => {
    it("calculates the correct answer", () => {
        expect(part1(testInput)).toBe(24);
    });
});


describe("part2", () => {
    it("calculates the correct answer", () => {
        expect(part2(testInput)).toBe(93);
    });
});
