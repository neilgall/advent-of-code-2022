import { triple, number, literal, Parser } from "../lib/parser";
import { down, left, Point, UnboundedPointMap, right, PointMap, BoundedPointMap } from "../lib/pointMap";

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

export type Cave = {
    map: PointMap<Tile>;
    entry: Point,
    floor?: number
};

export function buildCave(cave: Cave, traces: Trace[]) {
    cave.map.set(cave.entry, Tile.Entry);

    function draw(start: Point, end: Point) {
        if (start.y == end.y) {
            for (let x =  Math.min(start.x, end.x);
                     x <= Math.max(start.x, end.x);
                     x++)
                cave.map.set({ x, y: start.y }, Tile.Rock);
        } else {
            for (let y =  Math.min(start.y, end.y);
                     y <= Math.max(start.y, end.y);
                     y++)
                cave.map.set({ x: start.x, y }, Tile.Rock);
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

export function makeBoundedCave(traces: Trace[]): Cave {
    const entryPoint = { x: 500, y: 0 };
    const [topLeft, bottomRight] = boundingBox([
        ...traces,
        [entryPoint],
    ]);
    const cave = {
        map: new BoundedPointMap(topLeft, bottomRight, Tile.Air),
        entry: entryPoint,
    };
    buildCave(cave, traces);
    return cave;
}

export function makeUnboundedCave(traces: Trace[]): Cave {
    const [_, bottomRight] = boundingBox(traces);
    const cave = {
        map: new UnboundedPointMap(Tile.Air),
        entry: { x: 500, y: 0 },
        floor: bottomRight.y + 1
    };
    buildCave(cave, traces);
    return cave;
}

export function dropSand(cave: Cave): boolean {
    let p = cave.entry;
    while (true) {
        if (p.y === cave.floor) {
            cave.map.set(p, Tile.Sand);
            return true;
        }
        const d = down(p);
        if (!cave.map.contains(d)) {
            return false;
        }
        else if (cave.map.get(d) === Tile.Air) {
            p = d;
            continue;
        }
        else if (!cave.map.contains(left(d))) {
            return false; 
        }
        else if (cave.map.get(left(d)) === Tile.Air) {
            p = left(d);
            continue;
        }
        else if (!cave.map.contains(right(d))) {
            return false;
        }
        else if (cave.map.get(right(d)) === Tile.Air) {
            p = right(d);
            continue;
        }
        
        cave.map.set(p, Tile.Sand);
        return true;
    }
}

export function fillWithSand(cave: Cave): number {
    let count = 0;
    while (dropSand(cave)) {
        count += 1;
    }
    return count;
}

export function fillWithSand2(cave: Cave): number {
    let count = 0;
    while (cave.map.get(cave.entry) !== Tile.Sand) {
        dropSand(cave);
        count += 1;
    }
    return count;
}

export function part1(input: string): number {
    const cave = makeBoundedCave(parseInput(input));
    return fillWithSand(cave);
}

export function part2(input: string): number {
    const cave = makeUnboundedCave(parseInput(input));
    return fillWithSand2(cave);
}
