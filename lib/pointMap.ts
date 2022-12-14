export type Point = {
    x: number;
    y: number;
};

export class PointMap<T> {
    private readonly keys: Point[];
    private readonly map: Map<Point, T>;

    constructor(
        private readonly width: number,
        private readonly height: number,
        private readonly defaultValue: T,
    ) {
        this.keys = [];
        this.map = new Map();
        for (let y = 0; y < height; ++y) {
            for (let x = 0; x < width; ++x) {
                const p: Point = { x, y };
                this.keys.push(p);
                this.map.set(p, defaultValue);
            }
        }
    }

    private key(p: Point): Point {
        if (p.x < 0 || this.width <= p.x || p.y < 0 || this.height <= p.y) {
            throw new Error(`invalid point ${p.x},${p.y}`);
        }
        return this.keys[p.x + p.y * this.width];
    }

    public set(p: Point, value: T) {
        this.map.set(this.key(p), value);
    }

    public get(p: Point): T {
        return this.map.get(this.key(p)) || this.defaultValue;
    }
};