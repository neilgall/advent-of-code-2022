export type Point = {
    x: number;
    y: number;
};

export type ElevationMap = {
    cells: number[][];
    target: Point
};

export function parseInput(input: string): ElevationMap {
    const a = "a".charCodeAt(0);
    let target: Point | undefined;
    const cells = input.trim().split("\n").map((line, y) =>
        line.split("").map((c, x) => {
            switch (c) {
                case 'S': return 0;
                case 'E': target = { x, y }; return 25;
                default: return c.charCodeAt(0) - a;
            }
        })
    );
    if (!target) throw new Error("target not found");
    return { cells, target };
}

export function part1(input: string): number {
    return 0;
}

export function part2(input: string): number {
    return 0;
}