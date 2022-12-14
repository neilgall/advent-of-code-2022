import { triple, number, literal, Parser } from "../lib/parser";
import { Point, PointMap } from "../lib/pointMap";

export type Trace = Point[];

export function parseInput(input: string): Trace[] {
    const point: Parser<Point> = triple(
        number,
        literal(","),
        number,
        (x, _, y) => ({ x, y })
    );

    const trace: Parser<Trace> = point.sepBy(literal(" -> "));

    const traces = input.trim().split("\n").map(trace.parse);
    return traces.map((t, i) => {
        if (t.ok) return t.value;
        else throw new Error(`line ${i}: expected: ${t.expected} at ${t.at}`);
    });
}

export function boundingBox(traces: Trace[]): [Point, Point] {
    let xmin = Number.MAX_SAFE_INTEGER,
        ymin = Number.MAX_SAFE_INTEGER,
        xmax = Number.MIN_SAFE_INTEGER,
        ymax = Number.MIN_SAFE_INTEGER;
    for (const trace of traces) {
        for (const point of trace) {
            xmin = Math.min(xmin, point.x);
            ymin = Math.min(ymin, point.y);
            xmax = Math.max(xmax, point.x);
            ymax = Math.max(ymax, point.y);
        }
    }
    return [{ x: xmin, y: ymin }, { x: xmax, y: ymax }];
}

export enum Tile {
    Air = 0,
    Rock = 1,
    Entry = 2,
    Sand = 3,
};

export type Cave = PointMap<Tile>;

export function buildCave(traces: Trace[]): Cave {
    const entryPoint = { x: 500, y: 0 };
    const [topLeft, bottomRight] = boundingBox([
        ...traces, [entryPoint]
    ]);
    const cave = new PointMap(topLeft, bottomRight, Tile.Air);
    cave.set(entryPoint, Tile.Entry);

    function draw(start: Point, end: Point) {
        if (start.y == end.y) {
            for (let x =  Math.min(start.x, end.x);
                     x <= Math.max(start.x, end.x);
                     x++)
                cave.set({ x, y: start.y }, Tile.Rock);
        } else {
            for (let y =  Math.min(start.y, end.y);
                     y <= Math.max(start.y, end.y);
                     y++)
                cave.set({ x: start.x, y }, Tile.Rock);
        }
    }

    for (const trace of traces) {
        let prev: Point | undefined;
        for (const point of trace) {
            if (prev !== undefined) {
                draw(prev, point);
            }
            prev = point;
        }
    }

    return cave;
}

export function part1(input: string): number {
    return 0;
}

export function part2(input: string): number {
    return 0;
}