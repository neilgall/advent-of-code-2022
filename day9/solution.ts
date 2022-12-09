export enum Direction {
    Up, Down, Left, Right
};

export type Move = {
    direction: Direction;
    steps: number;
};

export function parseInput(input: string): Move[] {
    const dirMap: { [dir: string]: Direction } = {
        "D": Direction.Down,
        "U": Direction.Up,
        "L": Direction.Left,
        "R": Direction.Right
    };
    return input.trim().split("\n").map((line) => {
        const [d, s] = line.split(" ");
        const direction = dirMap[d];
        const steps = Number(s);
        if (direction === undefined)
        throw new Error(`can't parse '${d}'`);
        return { direction, steps };
    });
}

export function part1(input: string): number {
    return 0;
}

export function part2(input: string): number {
    return 0;
}