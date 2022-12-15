import { Point, UnboundedPointMap } from "../lib/pointMap";
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

export function manhatten(p1: Point, p2: Point): number {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

export type Sensor = SensorReport & {
    minDistance: number;
}

export function buildSensor(report: SensorReport): Sensor {
    return {
        ...report,
        minDistance: manhatten(report.sensor, report.beacon)
    };
}

export enum Tile {
    Empty,
    Sensor,
    Beacon,
};

export function countLocationsWithNoSensor(sensors: Sensor[], y: number): number {
    const minx = Math.min(
        ...sensors.map(({sensor, minDistance}) => sensor.x - minDistance)
    );
    const maxx = Math.max(
        ...sensors.map(({sensor, minDistance}) => sensor.x + minDistance)
    );
    const map = new UnboundedPointMap(Tile.Empty);
    sensors.forEach(({ sensor, beacon }) => {
        map.set(sensor, Tile.Sensor);
        map.set(beacon, Tile.Beacon);
    });

    let count = 0;
    for (let x = minx; x < maxx; ++x) {
        const p = { x, y };
        if (map.get(p) !== Tile.Beacon 
            && sensors.some(({sensor, minDistance}) =>
                manhatten(sensor, p) <= minDistance
        )) {
            count++;
        }
    }
    return count;
}

export function part1(input: string, y = 2_000_000): number {
    const sensors = parseInput(input).map(buildSensor);
    return countLocationsWithNoSensor(sensors, y);
}

export function part2(input: string): number {
    return 0;
}