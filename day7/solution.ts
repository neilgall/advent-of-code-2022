export type Entry = {
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
    results: Entry[];
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
            return state;
        }
    };
    
    const finalState = input.split("\n")
        .reduce(parseLine, { commands: [] });

    return finishCommand(finalState).commands;
}

export function part1(input: string): number {
    return 0;
}

export function part2(input: string): number {
    return 0;
}