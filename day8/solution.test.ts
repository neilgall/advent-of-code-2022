import { 
    parseInput,
    part1,
    part2,
    Point,
    scenicScore,
} from "./solution";

  const testInput = 
`30373
25512
65332
33549
35390
`;

const testForest = [
    [3, 0, 3, 7, 3],
    [2, 5, 5, 1, 2],
    [6, 5, 3, 3, 2],
    [3, 3, 5, 4, 9],
    [3, 5, 3, 9, 0]
];

describe("parseInput", () => {
    it("parses the input", () => {
        const f = parseInput(testInput);
        expect(f.trees).toStrictEqual(testForest);
        expect(f.width).toBe(5);
        expect(f.height).toBe(5);
    });
});


describe("part1", () => {
    it("calculates the correct answer", () => {
        expect(part1(testInput)).toBe(21);
    });
});


describe("part2", () => {
    const forest = parseInput(testInput);

    it.each([
        [{ x: 2, y: 1 }, 4],
        [{ x: 2, y: 3 }, 8],
    ])("calculates scenic scores", (p: Point, expected: number) => {
        expect(scenicScore(forest, p)).toBe(expected);
    });

    it("calculates the correct answer", () => {
        expect(part2(testInput)).toBe(8);
    });
});
