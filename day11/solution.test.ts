import { 
    parseInput,
    part1,
    part2,
 } from "./solution";
import {
    integer,
    literal,
    ParseOk,
    whitespace
} from "./parser";

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
        const p = integer.between(literal("Monkey "), literal(":")).followedBy(whitespace);
        expect(p.parse("Monkey 0:\n")).toStrictEqual(new ParseOk(0, ""));
    });

    it("parses the input", () => {
        const monkeys = parseInput(testInput);
        expect(monkeys).toStrictEqual([
            { 
                id: 0,
                startingItems: [79, 98],
                operation: { type: "*", lhs: { type: "var", name: "old" }, rhs: { type: "lit", value: 19 }},
                condition: { type: "div", by: 23, ifTrue: 2, ifFalse: 3 }
            },
            {
                id: 1,
                startingItems: [54, 65, 75, 74],
                operation: { type: "+", lhs: { type: "var", name: "old" }, rhs: { type: "lit", value: 6 }},
                condition: { type: "div", by: 19, ifTrue: 2, ifFalse: 0 },
            },
            {
                id: 2,
                startingItems: [79, 60, 97],
                operation: { type: "*", lhs: { type: "var", name: "old" }, rhs: { type: "var", name: "old" }},
                condition: { type: "div", by: 13, ifTrue: 1, ifFalse: 3 },
            },
            {
                id: 3,
                startingItems: [74],
                operation: { type: "+", lhs: { type: "var", name: "old" }, rhs: { type: "lit", value: 3 }},
                condition: { type: "div", by: 17, ifTrue: 0, ifFalse: 1 },
            },
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
