export function sum(ns: number[]): number {
    return ns.reduce((s, n) => s + n);
}

export function collect<T>(g: Generator<T>): T[] {
    const r = [];
    for (const i of g) {
        r.push(i);
    }
    return r;
}
