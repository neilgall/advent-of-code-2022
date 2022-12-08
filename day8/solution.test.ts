import { 
    Forest,
    parseInput,
    pointKey,
    part1,
    part2,
} from "./solution";
import {
    Map
} from "immutable";
import * as matchers from 'jest-immutable-matchers';

beforeEach(function () {
    expect.extend(matchers);
});

  const testInput = 
`30373
25512
65332
33549
35390
`;

const testForest = Map([
    [pointKey({ x: 0, y: 0 }), 3],
    [pointKey({ x: 1, y: 0 }), 0],
    [pointKey({ x: 2, y: 0 }), 3],
    [pointKey({ x: 3, y: 0 }), 7],
    [pointKey({ x: 4, y: 0 }), 3],

    [pointKey({ x: 0, y: 1 }), 2],
    [pointKey({ x: 1, y: 1 }), 5],
    [pointKey({ x: 2, y: 1 }), 5],
    [pointKey({ x: 3, y: 1 }), 1],
    [pointKey({ x: 4, y: 1 }), 2],

    [pointKey({ x: 0, y: 2 }), 6],
    [pointKey({ x: 1, y: 2 }), 5],
    [pointKey({ x: 2, y: 2 }), 3],
    [pointKey({ x: 3, y: 2 }), 3],
    [pointKey({ x: 4, y: 2 }), 2],

    [pointKey({ x: 0, y: 3 }), 3],
    [pointKey({ x: 1, y: 3 }), 3],
    [pointKey({ x: 2, y: 3 }), 5],
    [pointKey({ x: 3, y: 3 }), 4],
    [pointKey({ x: 4, y: 3 }), 9],

    [pointKey({ x: 0, y: 4 }), 3],
    [pointKey({ x: 1, y: 4 }), 5],
    [pointKey({ x: 2, y: 4 }), 3],
    [pointKey({ x: 3, y: 4 }), 9],
    [pointKey({ x: 4, y: 4 }), 0],
]);

describe("parseInput", () => {
    it("parses the input", () => {
        const f = parseInput(testInput);
        expect(f.trees).toEqualImmutable(testForest);
        expect(f.width).toBe(5);
        expect(f.height).toBe(5);
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
