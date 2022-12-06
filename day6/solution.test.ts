import { part1 } from "./solution";


describe("part1", () => {
    it.each([
        ["mjqjpqmgbljsphdztnvjfqwrcgsmlb", 7],
        ["bvwbjplbgvbhsrlpgdmjqwftvncz", 5],
        ["nppdvjthqldpwncqszvftbrmjlhg", 6],
        ["nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg", 10],
        ["zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw", 11]
    ])("calculates the position for %s", (input, expected) => {
        expect(part1(input)).toBe(expected);
    })
});


describe("part2", () => {

});
