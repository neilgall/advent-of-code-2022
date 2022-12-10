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

export type Point = {
    x: number;
    y: number;
};

export function point(x: number, y: number): Point {
    return { x, y };
}

export function pointKey(p: Point): string {
    return `${p.x},${p.y}`;
}

export function keyPoint(s: string): Point {
    const [x, y] = s.split(",").map(Number);
    return { x, y };
}

export function movePoint(p: Point, dir: Direction): Point {
    switch (dir) {
        case Direction.Up:
            return { x: p.x, y: p.y-1 };
        case Direction.Down:
            return { x: p.x, y: p.y+1 };
        case Direction.Left:
            return { x: p.x-1, y: p.y };
        case Direction.Right:
            return { x: p.x+1, y: p.y };
    };
}

export type Grid = {
    knots: Point[];
    visited: Set<string>;
};

export function moveTail(head: Point, tail: Point): Point {
    const dx = Math.abs(head.x - tail.x);
    const dy = Math.abs(head.y - tail.y);
    if (dx < 2 && dy < 2) {
        return tail;
    }

    if (dx === 0) {
        return head.y > tail.y
            ? movePoint(tail, Direction.Down)
            : movePoint(tail, Direction.Up);
    } 
    if (dy === 0) {
        return head.x > tail.x
            ? movePoint(tail, Direction.Right)
            : movePoint(tail, Direction.Left);
    }

    let newTail = head.y > tail.y
        ? movePoint(tail, Direction.Down)
        : movePoint(tail, Direction.Up);
    return head.x > tail.x
        ? movePoint(newTail, Direction.Right)
        : movePoint(newTail, Direction.Left);
}

export function applyMove(g: Grid, d: Direction): Grid {
    const knots = [movePoint(g.knots[0], d)];
    for (let i = 1; i < g.knots.length; ++i) {
        knots.push(moveTail(knots[i-1], g.knots[i]));
    }
    const tail = pointKey(knots[knots.length - 1]);
    const visited = g.visited.add(tail);
    return { knots, visited };
}

export function applyMoves(g: Grid, ms: Move[]): Grid {
    let grid = { ...g };
    for (const m of ms) {
        for (let i = 0; i < m.steps; ++i) {
            grid = applyMove(grid, m.direction);
        }
    }
    return grid;
}

export function initialGrid(start: Point, numKnots: number) {
    const knots = [];
    for (let i = 0; i < numKnots; ++i) {
        knots.push(start);
    }
    return { 
        knots,
        visited: new Set([pointKey(start)]),
    };
}

export function render(g: Grid) {
    let minx = 0, maxx = 0, miny = 0, maxy = 0;
    g.visited.forEach((k) => {
        const p = keyPoint(k);
        minx = Math.min(minx, p.x);
        maxx = Math.max(maxx, p.x);
        miny = Math.min(miny, p.y);
        maxy = Math.max(maxy, p.y);
    });
    let box = "";
    for (let y = miny; y <= maxy; ++y) {
        let row = "";
        for (let x = minx; x <= maxx; ++x) {
            row += g.visited.has(pointKey(point(x, y))) ? "#" : ".";
        }
        box += row + "\n";
    }
    console.log(box);
}

export function part1(input: string): number {
    const moves = parseInput(input);
    const grid = applyMoves(initialGrid(point(0, 0), 2), moves);
    return grid.visited.size;
}


export type Grid2 = {
    head: Point;
    knots: Point[];
    visited: Set<string>;
};

export function part2(input: string): number {
    const moves = parseInput(input);
    const grid = applyMoves(initialGrid(point(0, 0), 10), moves);
    // render(grid);
    return grid.visited.size;
}