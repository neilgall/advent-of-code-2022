export type Point = {
    x: number;
    y: number;
};

export type Move = (p: Point) => Point;

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

export type Height = number;

export type Forest = {
    trees: Height[][];
    width: number;
    height: number;
};

export function parseInput(input: string): Forest {
    function parseLine(f: Forest, line: string, y: number): Forest {
        return {
            trees: [...f.trees, line.trim().split("").map(Number)],
            width: Math.max(f.width, line.length),
            height: Math.max(f.height, y + 1),
        };
    }

    return input.trim().split("\n").reduce(parseLine, { 
        trees: [],
        width: 0, 
        height: 0,
    });
}

export function heightAt(f: Forest, p: Point): Height {
    return f.trees[p.y][p.x];
}

export function visibleInDir(f: Forest, h: Height, p: Point, move: Move): boolean {
    if (p.x < 0 || p.y < 0 || p.x >= f.width || p.y >= f.height) {
        return true;
    }
    const t = heightAt(f, p);
    return t < h && visibleInDir(f, h, move(p), move);
}

export function visible(f: Forest, p: Point): boolean {
    const h = heightAt(f, p);
    return visibleInDir(f, h, up(p), up)
        || visibleInDir(f, h, down(p), down)
        || visibleInDir(f, h, left(p), left)
        || visibleInDir(f, h, right(p), right);
}

export function part1(input: string): number {
    const f = parseInput(input);
    let count = 0;
    for (let y = 0; y < f.height; ++y) {
        for (let x = 0; x < f.width; ++x) {
            if (visible(f, { x, y }))
                count++;
        }
    }
    return count;
}

export function scenicScoreInDir(f: Forest, h: Height, p: Point, move: Move): number {
    if (p.x < 0 || p.y < 0 || p.x >= f.width || p.y >= f.height) {
        return 0;
    }
    return heightAt(f, p) >= h
        ? 1
        : 1 + scenicScoreInDir(f, h, move(p), move);
}

export function scenicScore(f: Forest, p: Point): number {
    const h = heightAt(f, p);
    return scenicScoreInDir(f, h, up(p), up)
         * scenicScoreInDir(f, h, down(p), down)
         * scenicScoreInDir(f, h, left(p), left)
         * scenicScoreInDir(f, h, right(p), right);
}

export function part2(input: string): number {
    const f = parseInput(input);
    let bestScore = 0;
    for (let y = 0; y < f.height; ++y) {
        for (let x = 0; x < f.width; ++x) {
            bestScore = Math.max(bestScore, scenicScore(f, { x, y }));
        }
    }
    return bestScore;
}