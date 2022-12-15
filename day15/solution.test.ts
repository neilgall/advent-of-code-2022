import { 
    parseInput,
    part1,
    part2,
 } from "./solution";

const testInput = 
`Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3
`;

describe("parseInput", () => {
    it("parses the input", () => {
        expect(parseInput(testInput)).toStrictEqual([
            { sensor: { x: 2, y: 18 }, beacon: { x: -2, y: 15 }},
            { sensor: { x: 9, y: 16 }, beacon: { x: 10, y: 16 }},
            { sensor: { x: 13, y: 2 }, beacon: { x: 15, y: 3 }},
            { sensor: { x: 12, y: 14 }, beacon: { x: 10, y: 16 }},
            { sensor: { x: 10, y: 20 }, beacon: { x: 10, y: 16 }},
            { sensor: { x: 14, y: 17 }, beacon: { x: 10, y: 16 }},
            { sensor: { x: 8, y: 7 }, beacon: { x: 2, y: 10 }},
            { sensor: { x: 2, y: 0 }, beacon: { x: 2, y: 10 }},
            { sensor: { x: 0, y: 11 }, beacon: { x: 2, y: 10 }},
            { sensor: { x: 20, y: 14 }, beacon: { x: 25, y: 17 }},
            { sensor: { x: 17, y: 20 }, beacon: { x: 21, y: 22 }},
            { sensor: { x: 16, y: 7 }, beacon: { x: 15, y: 3 }},
            { sensor: { x: 14, y: 3 }, beacon: { x: 15, y: 3 }},
            { sensor: { x: 20, y: 1 }, beacon: { x: 15, y: 3 }},
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
