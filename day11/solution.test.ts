import { 
    calculateMod,
    iterateMonkeys,
    parseInput,
    part1,
    part1Reducer,
    part2,
    part2Reducer,
    WorryLevel,
 } from "./solution";
import {
    number,
    literal,
    ParseOk,
    whitespace
} from "../lib/parser";

const testInput = 
`Monkey 0:
Starting items: 79, 98
Operation: new = old * 19
Test: divisible by 23
  If true: throw to monkey 2
  If false: throw to monkey 3

Monkey 1:
Starting items: 54, 65, 75, 74
Operation: new = old + 6
Test: divisible by 19
  If true: throw to monkey 2
  If false: throw to monkey 0

Monkey 2:
Starting items: 79, 60, 97
Operation: new = old * old
Test: divisible by 13
  If true: throw to monkey 1
  If false: throw to monkey 3

Monkey 3:
Starting items: 74
Operation: new = old + 3
Test: divisible by 17
  If true: throw to monkey 0
  If false: throw to monkey 1
`;

describe("parseInput", () => {
    it("parses the monkey line", () => {
        const p = number.between(literal("Monkey "), literal(":")).followedBy(whitespace);
        expect(p.parse("Monkey 0:\n")).toStrictEqual(new ParseOk(0, ""));
    });

    it("parses the input", () => {
        const monkeys = parseInput(testInput);
        expect(monkeys).toStrictEqual([
            { 
                id: 0,
                items: [79, 98],
                operation: { 
                    type: "*",
                    lhs: { type: "term", term: { type: "var", name: "old" } },
                    rhs: { type: "term", term: { type: "lit", value: 19 } },
                },
                condition: { type: "div", by: 23, ifTrue: 2, ifFalse: 3 }
            },
            {
                id: 1,
                items: [54, 65, 75, 74],
                operation: { 
                    type: "+", 
                    lhs: { type: "term", term: { type: "var", name: "old" } },
                    rhs: { type: "term", term: { type: "lit", value: 6 } },
                },
                condition: { type: "div", by: 19, ifTrue: 2, ifFalse: 0 },
            },
            {
                id: 2,
                items: [79, 60, 97],
                operation: { 
                    type: "*", 
                    lhs: { type: "term", term: { type: "var", name: "old" } },
                    rhs: { type: "term", term: { type: "var", name: "old" } },
                },
                condition: { type: "div", by: 13, ifTrue: 1, ifFalse: 3 },
            },
            {
                id: 3,
                items: [74],
                operation: { 
                    type: "+", 
                    lhs: { type: "term", term: { type: "var", name: "old" } },
                    rhs: { type: "term", term: { type: "lit", value: 3 } },
                },
                condition: { type: "div", by: 17, ifTrue: 0, ifFalse: 1 },
            },
        ]);
    });
});


describe("part1", () => {
    it("performs a single round correctly", () => {
        const monkeys = parseInput(testInput);
        iterateMonkeys(monkeys, 1, part1Reducer);
        expect(monkeys[0].items).toStrictEqual([20, 23, 27, 26]);
        expect(monkeys[1].items).toStrictEqual([2080, 25, 167, 207, 401, 1046]);
        expect(monkeys[2].items).toHaveLength(0);
        expect(monkeys[3].items).toHaveLength(0);
    });

    it("performs two rounds correctly", () => {
        const monkeys = parseInput(testInput);
        iterateMonkeys(monkeys, 2, part1Reducer);
        expect(monkeys[0].items).toStrictEqual([695, 10, 71, 135, 350]);
        expect(monkeys[1].items).toStrictEqual([43, 49, 58, 55, 362]);
        expect(monkeys[2].items).toHaveLength(0);
        expect(monkeys[3].items).toHaveLength(0);
    });

    it("performs 20 rounds correctly", () => {
        const monkeys = parseInput(testInput);
        iterateMonkeys(monkeys, 20, part1Reducer);
        expect(monkeys[0].items).toStrictEqual([10, 12, 14, 26, 34]);
        expect(monkeys[1].items).toStrictEqual([245, 93, 53, 199, 115]);
        expect(monkeys[2].items).toHaveLength(0);
        expect(monkeys[3].items).toHaveLength(0);
    });

    it("counts inspections correctly", () => {
        const monkeys = parseInput(testInput);
        const inspections = iterateMonkeys(monkeys, 20, part1Reducer);
        expect(inspections).toStrictEqual([101, 95, 7, 105]);
    });

    it("calculates the correct answer", () => {
        expect(part1(testInput)).toBe(10605);
    });
});


describe("part2", () => {
    it("calculates the modulo", () => {
        const monkeys = parseInput(testInput);
        const mod = calculateMod(monkeys);
        expect(mod).toBe(23 * 19 * 13 * 17);        
    });

    it("counts inspections correctly after one round", () => {
        const monkeys = parseInput(testInput);
        const inspections = iterateMonkeys(monkeys, 1, part2Reducer(monkeys));
        expect(inspections).toStrictEqual([2, 4, 3, 6]);
    });

    it("counts inspections correctly after 20 rounds", () => {
        const monkeys = parseInput(testInput);
        const inspections = iterateMonkeys(monkeys, 20, part2Reducer(monkeys));
        expect(inspections).toStrictEqual([99, 97, 8, 103]);
    });

    it("counts inspections correctly after 10,000 rounds", () => {
        const monkeys = parseInput(testInput);
        const inspections = iterateMonkeys(monkeys, 10_000, part2Reducer(monkeys));
        expect(inspections).toStrictEqual([52166, 47830, 1938, 52013]);
    });

    it("calculates the correct answer", () => {
        expect(part2(testInput)).toBe(2713310158);
    });
});
