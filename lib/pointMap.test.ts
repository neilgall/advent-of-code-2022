import { PointMap } from "./pointMap";

describe("PointMap", () => {
    it("retrieves values for points", () => {
        const m = new PointMap<string>(10, 10, "");
        m.set({ x: 3, y: 2 }, "foo");
        m.set({ x: 9, y: 4 }, "bar");
        expect(m.get({ x: 3, y: 2 })).toBe("foo");
        expect(m.get({ x: 9, y: 4 })).toBe("bar");
        expect(m.get({ x: 0, y: 3 })).toBe("");
    });

    it.each([
        { x: -1, y: 0 },
        { x: 10, y: 9 },
        { x: 0, y: -1 },
        { x: 9, y: 10 },
    ])("rejects invalid point %s", (p) => {
        const m = new PointMap(10, 10, "");
        expect(() => m.set(p, "foo")).toThrowError(`invalid point ${p.x},${p.y}`);
        expect(() => m.get(p)).toThrowError(`invalid point ${p.x},${p.y}`);
    });
});