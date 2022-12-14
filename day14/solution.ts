import { triple, number, literal, Parser, whitespace } from "../lib/parser";
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

export function part1(input: string): number {
    return 0;
}

export function part2(input: string): number {
    return 0;
}