export type Stack = string[];
export type Stacks = Stack[];

export type Move = {
    count: number;
    from: number;
    to: number;
};

export function parseStacks(input: string): Stacks {
    const stacks: Stacks = [[], [], [], [], [], [], [], [], []];
    for (const line of input.split("\n")) {
        if (line.startsWith(" 1 ")) {
            break;
        }
        for (let i = 0; i < 9; ++i) {
            const pos = i*4+1;
            const c = line[pos];
            if (pos <= line.length && c !== " ") {
                stacks[i] = [...stacks[i], c];
            }
        }
    }
    return stacks;
}

export function parseMoves(input: string): Move[] {
    const move = /move\s+(\d+)\s+from\s+(\d+)\s+to\s+(\d+)/;
    const moves = [];
    for (const line of input.split("\n")) {
        let m = move.exec(line);
        if (m) {
            moves.push({
                count: Number(m[1]),
                from: Number(m[2]),
                to: Number(m[3])
            });
        }
    }
    return moves;
}

export function applyMove(stacks: Stacks, move: Move): Stacks {
    const s = [...stacks];
    for (let i = 0; i < move.count; ++i) {
        const from = move.from - 1;
        const to = move.to - 1;
        s[to] = [ s[from][0], ...s[to] ];
        s[from] = s[from].slice(1);
    }
    return s;
}

export function part1(input: string): string {
    const moves = parseMoves(input);
    let stacks = parseStacks(input);
    
    for (const move of moves) {
        stacks = applyMove(stacks, move);    
    }

    return stacks.map((s) => s[0]).join("");
}

export function part2(input: string): number {
    return 0;
}