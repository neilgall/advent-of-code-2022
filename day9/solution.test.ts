import { 
    Direction,
    Point,
    point,
    parseInput,
    part1,
    part2,
    pointKey,
    moveTail,
 } from "./solution";
 import { readFileSync } from "fs";

const testInput = 
`R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`;

const testInput2 =
`R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`;

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

    it("gets all the steps", () => {
        const input = readFileSync("input.txt", "utf8").toString();
        expect(parseInput(input).length).toBe(2000);

    });
});

describe("Point", () => {
    it("can be inserted into a record", () => {
        const ps: Record<string, string> = {};
        ps[pointKey({ x: 3, y: 4 })] = "foo";
        ps[pointKey({ x: 4, y: 3 })] = "bar";

        expect(ps[pointKey({ x: 3, y: 4 })]).toBe("foo");
        expect(ps[pointKey({ x: 4, y: 3 })]).toBe("bar");
    })
});

describe("moveTail", () => {
    it.each([
        // 2 rows above
        [point(0, 0), point(1, 1)],
        [point(1, 0), point(2, 1)],
        [point(2, 0), point(2, 1)],
        [point(3, 0), point(2, 1)],
        [point(4, 0), point(3, 1)],
        // 1 row above
        [point(0, 1), point(1, 2)],
        [point(1, 1), point(1, 1)],
        [point(2, 1), point(2, 1)],
        [point(3, 1), point(3, 1)],
        [point(4, 1), point(3, 2)],
        // same row
        [point(0, 2), point(1, 2)],
        [point(1, 2), point(1, 2)],
        [point(2, 2), point(2, 2)],
        [point(3, 2), point(3, 2)],
        [point(4, 2), point(3, 2)],
        // 1 row below
        [point(0, 3), point(1, 2)],
        [point(1, 3), point(1, 3)],
        [point(2, 3), point(2, 3)],
        [point(3, 3), point(3, 3)],
        [point(4, 3), point(3, 2)],
        // 2 rows below
        [point(0, 4), point(1, 3)],
        [point(1, 4), point(2, 3)],
        [point(2, 4), point(2, 3)],
        [point(3, 4), point(2, 3)],
        [point(4, 4), point(3, 3)],
    ])("moves tail correctly %s -> %s", (tail, expected) => {
        expect(moveTail(point(2, 2), tail)).toStrictEqual(expected);
    });
})

describe("part1", () => {
    it("calculates the correct answer", () => {
        expect(part1(testInput)).toBe(13);
    });
});


describe("part2", () => {
    it("calculates the correct answer", () => {
        expect(part2(testInput)).toBe(1);
        expect(part2(testInput2)).toBe(36);
    });
});
