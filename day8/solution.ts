import { Map } from "immutable";

export type Point = {
    x: number;
    y: number;
};

function up(p: Point): Point {
    return { x: p.x, y: p.y - 1 };
}
function down(p: Point): Point {
    return { x: p.x, y: p.y + 1 };
}
function left(p: Point): Point {
    return { x: p.x - 1, y: p.y };
}
function right(p: Point): Point {
    return { x: p.x + 1, y: p.y };
}

export type PointKey = string;
export type TreeHeight = number;

export type Forest = {
    trees: Map<PointKey, TreeHeight>;
    width: number;
    height: number;
};

export function pointKey(p: Point): PointKey {
    return `${p.x},${p.y}`;
}

export function parseInput(input: string): Forest {
    function parseLine(f: Forest, line: string, y: number): Forest {
        return line.trim().split("").reduce((g: Forest, t: string, x: number): Forest => {
            return {
                trees: g.trees.set(pointKey({ x, y }), Number(t)),
                width: Math.max(g.width, x + 1),
                height: Math.max(g.height, y + 1),
            }
        }, f);
    }

    return input.split("\n").reduce(parseLine, { 
        trees: Map(),
        width: 0, 
        height: 0,
    });
}

export function part1(input: string): number {
    return 0;
}

export function part2(input: string): number {
    return 0;
}