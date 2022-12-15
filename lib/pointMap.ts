export type Point = {
    x: number;
    y: number;
};

export function up(p: Point): Point {
    return { x: p.x, y: p.y - 1 };
}

export function down(p: Point): Point {
    return { x: p.x, y: p.y + 1 };
}

export function left(p: Point): Point {
    return { x: p.x - 1, y: p.y };
}

export function right(p: Point): Point {
    return { x: p.x + 1, y: p.y };
}

export interface PointMap<T> extends Iterable<Point> {
    render(tile: (t: T) => string): Generator<string>;
    contains(p: Point): boolean;
    set(p: Point, value: T): void;
    get(p: Point): T;
}


export class BoundedPointMap<T> implements PointMap<T> {
    private readonly keys: Point[];
    private readonly map: Map<Point, T>;

    constructor(
        private readonly topLeft: Point,
        private readonly bottomRight: Point,
        private readonly defaultValue: T,
    ) {
        this.keys = [];
        this.map = new Map();
        for (let y = topLeft.y; y <= bottomRight.y; ++y) {
            for (let x = topLeft.x; x <= bottomRight.x; ++x) {
                const p: Point = { x, y };
                this.keys.push(p);
                this.map.set(p, defaultValue);
            }
        }
    }

    private key(p: Point): Point {
        if (!this.contains(p)) {
            throw new Error(`invalid point ${p.x},${p.y}`);
        }
        const width = this.bottomRight.x - this.topLeft.x + 1;
        const index = (p.x - this.topLeft.x) + (p.y - this.topLeft.y) * width;
        return this.keys[index];
    }

    public contains(p: Point): boolean {
        return (this.topLeft.x <= p.x
            && this.topLeft.y <= p.y
            && p.x <= this.bottomRight.x
            && p.y <= this.bottomRight.y);
    }

    public set(p: Point, value: T) {
        this.map.set(this.key(p), value);
    }

    public get(p: Point): T {
        return this.map.get(this.key(p)) || this.defaultValue;
    }

    public [Symbol.iterator](): Iterator<Point> {
        let { x, y } = this.topLeft;
        return {
            next: () => {
                const done = (x === this.bottomRight.x
                              && y === this.bottomRight.y);
                return {
                    done,
                    value: { x, y }
                };
            }
        };
    }

    public* render(tile: (t: T) => string): Generator<string> {
        for (let y = this.topLeft.y; y <= this.bottomRight.y; ++y) {
            let row = "";
            for (let x = this.topLeft.x; x <= this.bottomRight.x; ++x) {
                row += tile(this.get({ x, y }));
            }
            yield row;
        }
    }
};


export class UnboundedPointMap<T> implements PointMap<T> {
    private readonly map: { [p: string]: T };

    constructor(private readonly defaultValue: T) {
        this.map = {};
    }

    private key(p: Point): string {
        return `${p.x},${p.y}`;
    }

    private unkey(s: string): Point {
        const [x, y] = s.split(",").map(Number);
        return { x, y };
    }

    public contains(_: Point): boolean {
        return true;
    }

    public set(p: Point, value: T) {
        this.map[this.key(p)] = value;
    }

    public get(p: Point): T {
        return this.map[this.key(p)] || this.defaultValue;
    }

    public [Symbol.iterator](): Iterator<Point> {
        const keys = Object.keys(this.map).map(this.unkey);
        let i = 0;
        return {
            next: () => ({
                done: i === keys.length-1,
                value: keys[i]
            })
        };
    }

    public* render(tile: (t: T) => string): Generator<string> {
        let minx = Number.MAX_SAFE_INTEGER,
            miny = Number.MAX_SAFE_INTEGER,
            maxx = Number.MIN_SAFE_INTEGER,
            maxy = Number.MIN_SAFE_INTEGER;
        Object.keys(this.map).forEach((key) => {
            const p = this.unkey(key);
            minx = Math.min(minx, p.x);
            miny = Math.min(miny, p.y);
            maxx = Math.max(maxx, p.x);
            maxy = Math.max(maxy, p.y);
        });
        for (let y = miny; y <= maxy; ++y) {
            let row = "";
            for (let x = minx; x <= maxx; ++x) {
                row += tile(this.get({ x, y }));
            }
            yield row;
        }
    }
}
