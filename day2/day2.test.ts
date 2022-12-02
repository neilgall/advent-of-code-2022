import { Move, parseInput, score, part1, part2 } from "./day2";

const exampleStrategy = [
    { opponent: Move.Rock, you: Move.Paper },
    { opponent: Move.Paper, you: Move.Rock },
    { opponent: Move.Scissors, you: Move.Scissors }
];

describe("parser", () => {
    it("reads the test data", () => {
        const strategy = parseInput(
`A Y
B X
C Z`);
        expect(strategy).toStrictEqual(exampleStrategy);
    });
});

describe("score", () => {
    it.each([
        [exampleStrategy[0], 8],
        [exampleStrategy[1], 1],
        [exampleStrategy[2], 6]
])("%s", (round, expectedScore) => {
        expect(score(round)).toBe(expectedScore);
    })
})


describe("problems", () => {
    it("part1", () => {
        expect(part1(exampleStrategy)).toBe(15);
    });

    it("part2", () => {
    });
});
