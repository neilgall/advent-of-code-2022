import { readFileSync } from "fs";
import {
    Command,
    parseInput,
    Entry,
    DirEntry,
    buildDirectoryTree, 
    directorySizes,
    part1,
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
7214296 k
`;

const realInput = readFileSync("input.txt", "utf8").toString();

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

    it("gets the right number of commands", () => {
        const count = realInput
            .trim()
            .split("\n")
            .filter((line) => line.startsWith("$"))
            .length;
        expect(parseInput(realInput).length).toBe(count);
    });
});

describe("buildDirectoryTree", () => {
    it("builds the directory structure from the commands", () => {
        const commands = parseInput(testInput);
        const tree = buildDirectoryTree(commands);
        expect(tree).toStrictEqual(
            { type: "dir", name: "", path: [], entries: [
                { type: "dir", name: "a", path: [""], entries: [
                    { type: "dir", name: "e", path: ["", "a"], entries: [
                        { type: "file", name: "i", size: 584 },
                    ]},
                    { type: "file", name: "f", size: 29116 },
                    { type: "file", name: "g", size: 2557 },
                    { type: "file", name: "h.lst", size: 62596 },
                ]},
                { type: "file", name: "b.txt", size: 14848514 },
                { type: "file", name: "c.dat", size: 8504156 },
                { type: "dir", name: "d", path: [""], entries: [
                    { type: "file", name: "j", size: 4060174 },
                    { type: "file", name: "d.log", size: 8033020 },
                    { type: "file", name: "d.ext", size: 5626152 },
                    { type: "file", name: "k", size: 7214296 },
                ]},
            ]}
        );
    });

    it("finds all the directories", () => {
        function dirNames(dir: DirEntry): string[] {
            return [
                dir.name,
                ...dir.entries.flatMap((e) => 
                    e.type === "dir" ? dirNames(e) : []
                )
            ];
        }

        const dirs = [""].concat(
            realInput.trim()
                .split("\n")
                .filter((line) => line.startsWith("dir"))
                .map((line) => line.slice(4))
        );
        const tree = buildDirectoryTree(parseInput(realInput));
        
        expect(dirNames(tree).sort()).toStrictEqual(dirs.sort());
    });
});


describe("directorySizes", () => {
    it("calcuates directory sizes", () => {
        const tree = buildDirectoryTree(parseInput(testInput));
        expect(directorySizes(tree)).toStrictEqual({
            "/a/e": 584,
            "/a": 94853,
            "/d": 24933642,
            "/": 48381165
        });
    })
});

describe("part1", () => {
    it("calculates the correct answer", () => {
        expect(part1(testInput)).toBe(95437);
    })
});


describe("part2", () => {

});
