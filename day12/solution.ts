export type Point = {
    x: number;
    y: number;
};

export type ElevationMap = {
    cells: number[][];
    start: Point;
    target: Point
};

export function parseInput(input: string): ElevationMap {
    const a = "a".charCodeAt(0);
    let start: Point | undefined;
    let target: Point | undefined;
    const cells = input.trim().split("\n").map((line, y) =>
        line.split("").map((c, x) => {
            switch (c) {
                case 'S': start = { x, y }; return 0;
                case 'E': target = { x, y }; return 25;
                default: return c.charCodeAt(0) - a;
            }
        })
    );
    if (!start) throw new Error("start not found");
    if (!target) throw new Error("target not found");
    return { cells, start, target };
}

export function mapAt(map: ElevationMap, p: Point): number {
    return map.cells[p.y][p.x];
}

export function pointKey(p: Point): string {
    return `${p.x},${p.y}`;
}

export function keyPoint(s: string): Point {
    const [x, y] = s.split(",").map(Number);
    return { x, y };
}

export function* points(map: ElevationMap): Generator<Point> {
    for (let y = 0; y < map.cells.length; ++y) {
        for (let x = 0; x < map.cells[0].length; ++x) {
            yield { x, y };
        }
    }
}

export function* neighbours(map: ElevationMap, p: Point): Generator<Point> {
    if (p.y > 0)
        yield { x: p.x, y: p.y - 1};
    if (p.x > 0)
        yield { x: p.x - 1, y: p.y };
    if (p.y < map.cells.length - 1)
        yield { x: p.x, y: p.y + 1 };
    if (p.x < map.cells[0].length - 1)
        yield { x: p.x + 1, y: p.y };
}

export function dijkstra(map: ElevationMap): number {
    const unvisited: Set<string> = new Set();
    const dist: { [point: string]: number } = {};
    for (const p of points(map)) {
        unvisited.add(pointKey(p));
        dist[pointKey(p)] = Number.MAX_SAFE_INTEGER;
    }
    dist[pointKey(map.start)] = 0;

    function unvisitedWithMinDist(): [Point, number] {
        let d: number | undefined;
        let p: Point | undefined;
        for (const u of unvisited) {
            if (d === undefined || dist[u] < d) {
                d = dist[u];
                p = keyPoint(u);
            }
        }
        return [p!, d!];
    }

    while (unvisited.size > 0) {
        const [u, ud] = unvisitedWithMinDist();
        const hu = mapAt(map, u);
        let visited = false;

        for (const n of neighbours(map, u)) {
            if (mapAt(map, n) - hu <= 1) {
                visited = true;
                if (ud + 1 < dist[pointKey(n)]) {
                    dist[pointKey(n)] = ud + 1;
                }
            }
        }

        if (visited)
            unvisited.delete(pointKey(u));
    }

    return dist[pointKey(map.target)];
}

export function part1(input: string): number {
    const map = parseInput(input);
    return dijkstra(map);
}

export function part2(input: string): number {
    return 0;
}