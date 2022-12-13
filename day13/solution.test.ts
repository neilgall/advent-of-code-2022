import { 
    parseInput,
    part1,
    part2,
 } from "./solution";

const testInput = 
`[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`;

describe("parseInput", () => {
    it("parses single packet pairs", () => {
        expect(parseInput("[1]\n[2]")).toStrictEqual([
            [[1], [2]]
        ]);
    })

    it("parses the input", () => {
        expect(parseInput(testInput)).toStrictEqual([
            [[1,1,3,1,1], [1,1,5,1,1]],
            [[[1],[2,3,4]], [[1],4]],
            [[9], [[8,7,6]]],
            [[[4,4],4,4], [[4,4],4,4,4]],
            [[7,7,7,7], [7,7,7]],
            [[], [3]],
            [[[[]]], [[]]],
            [[1,[2,[3,[4,[5,6,7]]]],8,9], [1,[2,[3,[4,[5,6,0]]]],8,9]]
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
