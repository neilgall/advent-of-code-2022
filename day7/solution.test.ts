import {
    Command,
    parseInput,
} from "./solution";

const testInput=
`$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`;

describe("parseInput", () => {
    it("parses the input", () => {
        const commands = parseInput(testInput);
        expect(commands).toStrictEqual([
            { type: "root" },
            { type: "list", results: [
                { type: "dir", name: "a" },
                { type: "file", name: "b.txt", size: 14848514 },
                { type: "file", name: "c.dat", size: 8504156 },
                { type: "dir", name: "d" }
            ]},
            { type: "in", dest: "a" },
            { type: "list", results: [
                { type: "dir", name: "e" },
                { type: "file", name: "f", size: 29116 },
                { type: "file", name: "g", size: 2557 },
                { type: "file", name: "h.lst", size: 62596 },
            ]},
            { type: "in", dest: "e" },
            { type: "list", results: [
                { type: "file", name: "i", size: 584 },
            ]},
            { type: "out" },
            { type: "out" },
            { type: "in", dest: "d" },
            { type: "list", results: [
                { type: "file", name: "j", size: 4060174 },
                { type: "file", name: "d.log", size: 8033020 },
                { type: "file", name: "d.ext", size: 5626152 },
                { type: "file", name: "k", size: 7214296 }
            ]}
        ]);
    });
});


describe("part1", () => {

});


describe("part2", () => {

});
