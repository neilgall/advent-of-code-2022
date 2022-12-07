import { sum } from "./utils";

export type Result = {
    type: "file";
    name: string;
    size: number;
} | {
    type: "dir";
    name: string;
};

export type Command = {
    type: "in",
    dest: string
} | {
    type: "out"
} | {
    type: "root"
} | {
    type: "list",
    results: Result[];
};

export function parseInput(input: string): Command[] {
    type State = { commands: Command[], current?: Command };

    function finishCommand(state: State): State {
        const commands = [...state.commands];
        if (state.current) {
            commands.push(state.current);
        }
        return { commands, current: undefined };
    }

    function newCommand(state: State, line: string): State {
        const newState = finishCommand(state);

        switch (line.slice(2).trim()) {
            case "ls":
                newState.current = { type: "list", results: [] };
                break;
            case "cd /": 
                newState.current = { type: "root" };
                break;
            case "cd ..":
                newState.current = { type: "out" };
                break;
            default:
                if (line.startsWith("$ cd ")) {
                    newState.current = { type: "in", dest: line.slice(5).trim() };
                } else {
                    throw new Error(`can't parse line ${line}`);
                }
                break;
        }
        return newState;
    }

    function parseLine(state: State, line: string): State {
        if (line.startsWith("$ ")) {
            return newCommand(state, line);
        } else if (state.current?.type === "list") {
            const newResults = [...state.current.results];
            if (line.startsWith("dir ")) {
                newResults.push({ type: "dir", name: line.slice(4).trim() });
            } else {
                const [size, name] = line.split(" ");
                newResults.push({ type: "file", name, size: Number(size) });
            }
            return { 
                commands: state.commands, 
                current: { type: "list", results: newResults }
            };
        } else {
            throw new Error(`can't understand line ${line} in state ${state.current}`);
        }
    };
    
    const finalState = input.trim().split("\n")
        .reduce(parseLine, { commands: [] });

    return finishCommand(finalState).commands;
}

export type Entry = {
    type: "file";
    name: string;
    size: number;
} | {
    type: "dir";
    name: string;
    path: string[];
    entries: Entry[];
};

export type DirEntry = Entry & { type: "dir" };
export type Path = Entry[];

export function resultToEntry(r: Result, path: Path): Entry {
    return (r.type === "file")
        ? r
        : { ...r, path: path?.map((p) => p.name), entries: [] };
}

export function buildDirectoryTree(commands: Command[]): DirEntry {
    const root: DirEntry = { type: "dir", name: "", path: [], entries: [] };
    let path = [root];
    let current = root;
    for (const command of commands) {
        switch (command.type) {
            case "root": {
                current = root;
                path = [root];
                break;
            }
            case "in": {
                const match: Entry | undefined = current?.entries.find((e) => e.name === command.dest);
                if (match?.type === "dir") {
                    current = match;
                    path.push(current);
                } else {
                    throw new Error(`cd to file ${command.dest} from ${path.join("/")}`);
                }
                break;
            }
            case "out": {
                if (current?.path) {
                    path.pop();
                    current = path[path.length-1];
                } else {
                    throw new Error("popped too far!");
                }
                break;
            }
            case "list": {
                current.entries = [
                    ...current.entries, 
                    ...command.results.map((r) => resultToEntry(r, path))
                ];
                break;
            }
        }
    }
    return root;
}

export type DirSizes = Record<string, number>;

export function directorySizes(root: DirEntry): DirSizes {
    function walkTree(entry: DirEntry, sizes: DirSizes): number {
        let size = 0;
        for (const e of entry.entries) {
            if (e.type === "file") {
                size += e.size;
            } else {
                size += walkTree(e, sizes);
            }
        }
        const name = entry.path.join("/") + "/" + entry.name;
        if (sizes[name] !== undefined) {
            throw new Error(`duplicate path ${name}`);
        }

        sizes[name] = size;
        return size;
    }

    const results: DirSizes = {};
    walkTree(root, results);
    return results;
}

type NameSizePair = [string, number];

export function part1(input: string): number {
    const filterSizes = (sizes: DirSizes): NameSizePair[] => 
        Object.entries(sizes)
        .filter(([_, size]: NameSizePair) => size <= 100_000);

    const tree = buildDirectoryTree(parseInput(input));
    const smallDirs = filterSizes(directorySizes(tree));
    return sum(smallDirs.map(([_, size]) => size));
}

export function part2(input: string): number {
    const tree = buildDirectoryTree(parseInput(input));
    const sizes = directorySizes(tree);
    const needed = 70_000_000 - sizes["/"];
    const needToFree = 30_000_000 - needed;

    const filterSizes = (sizes: DirSizes): NameSizePair[] => 
        Object.entries(sizes)
        .filter(([_, size]: NameSizePair) => size >= needToFree);

    const bigDirs = filterSizes(sizes)
        .sort(([x, a]: NameSizePair, [y, b]: NameSizePair) => a - b);

    return bigDirs[0][1];
}
