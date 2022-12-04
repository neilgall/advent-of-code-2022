import { 
    parseInput, 
    parsePair, 
    parseRange, 
    rangesOverlapCompletely,
    rangesOverlap,
    part1,
    part2,
} from "./solution";

const testInput = 
`2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8
`;

describe("parseInput", () => {
    it.each([
        ["2-4", { min: 2, max: 4 }],
        ["123-456", { min: 123, max: 456 }]
    ])("parses %s", (input, expected) => {
        expect(parseRange(input)).toStrictEqual(expected);
    });

    it.each([
        ["2-4,6-8", { range1: { min: 2, max: 4 }, range2: { min: 6, max: 8 }}],
        ["2-3,4-5", { range1: { min: 2, max: 3 }, range2: { min: 4, max: 5 }}],
    ])("parses %s", (input, expected) => {
        expect(parsePair(input)).toStrictEqual(expected);
    });

    it("parses the input", () => {
        expect(parseInput(testInput)).toStrictEqual([
            { range1: { min: 2, max: 4 }, range2: { min: 6, max: 8 }},
            { range1: { min: 2, max: 3 }, range2: { min: 4, max: 5 }},
            { range1: { min: 5, max: 7 }, range2: { min: 7, max: 9 }},
            { range1: { min: 2, max: 8 }, range2: { min: 3, max: 7 }},
            { range1: { min: 6, max: 6 }, range2: { min: 4, max: 6 }},
            { range1: { min: 2, max: 6 }, range2: { min: 4, max: 8 }},
        ]);
    });
});


describe("part1", () => {
    it.each([
        ["2-4,6-8", false],
        ["2-3,4-5", false],
        ["5-7,7-9", false],
        ["2-8,3-7", true],
        ["6-6,4-6", true],
        ["2-6,4-8", false],
    ])("detects complete overlap in %s", (input, expected) => {
        const pair = parsePair(input);
        expect(pair).toBeDefined();
        expect(rangesOverlapCompletely(pair!)).toBe(expected);
    });

    it("calculates the correct answer", () => {
        expect(part1(testInput)).toBe(2);
    })
});


describe("part2", () => {
    it.each([
        ["2-4,6-8", false],
        ["2-3,4-5", false],
        ["5-7,7-9", true],
        ["2-8,3-7", true],
        ["6-6,4-6", true],
        ["2-6,4-8", true],
    ])("detects overlap in %s", (input, expected) => {
        const pair = parsePair(input);
        expect(pair).toBeDefined();
        expect(rangesOverlap(pair!)).toBe(expected);
    });

    it("calculates the correct answer", () => {
        expect(part2(testInput)).toBe(4);
    })
});
