import { Point } from "../lib/pointMap";
import { number, literal, triple, newline } from "../lib/parser";

type SensorReport = {
    sensor: Point;
    beacon: Point;
};

export function parseInput(input: string): SensorReport[] {
    const x = number.after(literal("x="));
    const y = number.after(literal("y="));
    const point = triple(
        x, literal(", "), y,
        (x, _, y) => ({ x, y })
    );
    const sensor = point.after(literal("Sensor at "));
    const beacon = point.after(literal(": closest beacon is at "));
    const report = sensor.then(beacon)
        .map(([sensor, beacon]) => ({ sensor, beacon }));

    const reports = report.sepBy(newline).parse(input.trim());
    if (reports.ok) {
        return reports.value;
    } else {
        throw new Error(`expected ${reports.expected} at ${reports.at}`);
    }
}

export function part1(input: string): number {
    return 0;
}

export function part2(input: string): number {
    return 0;
}