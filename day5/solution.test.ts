import { 
    parseStacks,
    parseMoves,
    applyMove,
    part1
} from "./solution";

const testInput = 
`    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
`;

describe("parseInput", () => {
    it("parses the stacks", () => {
        const stacks = parseStacks(testInput);
        expect(stacks).toStrictEqual([
            ["N", "Z"],
            ["D", "C", "M"],
            ["P"],
            [], [], [], [], [], []
        ]);
    });

    it("parses the moves", () => {
        const moves = parseMoves(testInput);
        expect(moves).toStrictEqual([
            { count: 1, from: 2, to: 1 },
            { count: 3, from: 1, to: 3 },
            { count: 2, from: 2, to: 1 },
            { count: 1, from: 1, to: 2 },
        ]);
    });
});


describe("applyMove", () => {
    it("applies the first move", () => {
        const stacks = parseStacks(testInput);
        const moves = parseMoves(testInput);
        const s = applyMove(stacks, moves[0]);
        expect(s).toStrictEqual([
            ["D", "N", "Z"],
            ["C", "M"],
            ["P"],
            [], [], [], [], [], []
        ]);
    });

    it("applies the second move", () => {
        const stacks = parseStacks(testInput);
        const moves = parseMoves(testInput);
        const s = applyMove(applyMove(stacks, moves[0]), moves[1]);
        expect(s).toStrictEqual([
            [],
            ["C", "M"],
            ["Z", "N", "D", "P"],
            [], [], [], [], [], []
        ]);
    
    }); 
});

describe("part1", () => {
    expect(part1(testInput)).toBe("CMZ");
});


describe("part2", () => {

});
