import { 
    parseInput,
    part1,
    part2,
    signalStrength,
    display,
 } from "./solution";
import { collect } from "./utils";

const shortTestInput = 
`noop
addx 3
addx -5
`;

const testInput = 
`addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`;

describe("parseInput", () => {
    it("parses the input", () => {
        expect(parseInput(shortTestInput)).toStrictEqual([
            { type: "noop" },
            { type: "addx", arg: 3 },
            { type: "addx", arg: -5 }
        ]);
    });
});

describe("part1", () => {
    it("generates correct signal strengths", () => {
        const instructions = parseInput(testInput);
        const ss = collect(signalStrength(instructions));
        expect(ss).toStrictEqual([
            420, 1140, 1800, 2940, 2880, 3960
        ]);
    });

    it("calculates the correct answer", () => {
        expect(part1(testInput)).toBe(13140);
    });
});


describe("part2", () => {
    it("renders the correct image", () => {
        const instructions = parseInput(testInput);
        const image = collect(display(instructions));
        expect(image).toStrictEqual([
            "##..##..##..##..##..##..##..##..##..##..",
            "###...###...###...###...###...###...###.",
            "####....####....####....####....####....",
            "#####.....#####.....#####.....#####.....",
            "######......######......######......####",
            "#######.......#######.......#######.....",
        ]);
    });
});
