import { 
    Move,
    Result,
    parseInput1,
    parseInput2,
    score1,
    score2,
    part1,
    part2 
} from "./day2";

const exampleStrategy1 = [
    { opponent: Move.Rock, you: Move.Paper },
    { opponent: Move.Paper, you: Move.Rock },
    { opponent: Move.Scissors, you: Move.Scissors }
];

const exampleStrategy2 = [
    { opponent: Move.Rock, result: Result.Draw },
    { opponent: Move.Paper, result: Result.Lose },
    { opponent: Move.Scissors, result: Result.Win }
];


describe("parser", () => {
    const testInput = 
`A Y
B X
C Z`;

    it("reads the test data for part 1", () => {
        const strategy = parseInput1(testInput);
        expect(strategy).toStrictEqual(exampleStrategy1);
    });

    it("reads the test data for part 2", () => {
        const strategy = parseInput2(testInput);
        expect(strategy).toStrictEqual(exampleStrategy2);
    });
});

describe("score1", () => {
    it.each([
        [exampleStrategy1[0], 8],
        [exampleStrategy1[1], 1],
        [exampleStrategy1[2], 6]
])("%s", (round, expectedScore) => {
        expect(score1(round)).toBe(expectedScore);
    });
});


describe("score2", () => {
    it.each([
        [exampleStrategy2[0], 4],
        [exampleStrategy2[1], 1],
        [exampleStrategy2[2], 7]
])("%s", (round, expectedScore) => {
        expect(score2(round)).toBe(expectedScore);
    })
})

describe("problems", () => {
    it("part1", () => {
        expect(part1(exampleStrategy1)).toBe(15);
    });

    it("part2", () => {
        expect(part2(exampleStrategy2)).toBe(12);
    });
});
