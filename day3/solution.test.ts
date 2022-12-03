import { 
    parseInput,
    group,
    findCommonItem,
    findGroupBadge,
    priority,
    part1,
    part2,
} from "./solution";

const testInput =
`vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw
`;

describe("parseInput", () => {
    it("parses one rucksack", () => {
        const [r] = parseInput("vJrwpWtwJgWrhcsFMMfFFhFp");
        expect(r.compartment1).toBe("vJrwpWtwJgWr");
        expect(r.compartment2).toBe("hcsFMMfFFhFp");
    });

    it("parses all the rucksacks", () => {
        const rs = parseInput(testInput);
        expect(rs).toHaveLength(6);
    });
});


describe("part1", () => {
    it.each([
        ["vJrwpWtwJgWrhcsFMMfFFhFp", "p"],
        ["jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL", "L"],
        ["PmmdzqPrVvPwwTWBwg", "P"],
        ["wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn", "v"],
        ["ttgJtRGJQctTZtZT", "t"],
        ["CrZsJsPPZsGzwwsLwLmpwMDw", "s"]
    ])("identifies the common item in %s", (input, expected) => {
        const [r] = parseInput(input);
        expect(findCommonItem(r)).toBe(expected); 
    });

    it.each([
        ["a", 1],
        ["e", 5],
        ["z", 26],
        ["A", 27],
        ["E", 31],
        ["Z", 52]
    ])("prioritises %s", (item, expected) => {
        expect(priority(item)).toBe(expected);
    });

    it("calculates for the test input", () => {
        expect(part1(testInput)).toBe(157);
    });
});


describe("part2", () => {
    it("finds the badge for a group", () => {
        const rs = parseInput(testInput);
        const gs = group(rs);
        expect(findGroupBadge(gs[0])).toBe("r");
        expect(findGroupBadge(gs[1])).toBe("Z");
    });

    it("calculates for the test input", () => {
        expect(part2(testInput)).toBe(70);
    });
});
