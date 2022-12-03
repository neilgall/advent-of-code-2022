import { sum } from "./utils";

export type Item = string;
export type Compartment = string;

export type Rucksack = {
    compartment1: Compartment;
    compartment2: Compartment;
};

export function parseInput(input: string): Rucksack[] {
    return input.trim().split("\n").map((line) => {
        const half = line.length / 2;
        return {
            compartment1: line.slice(0, half),
            compartment2: line.slice(half)
        }
    });
}

export function findCommonItem(r: Rucksack): Item {
    for (const item of r.compartment1) {
        if (r.compartment2.indexOf(item) >= 0) {
            return item;
        }
    }
    process.abort();
}

export function priority(item: Item): number {
    const code = item.charCodeAt(0);
    const a = "a".charCodeAt(0);
    const z = "z".charCodeAt(0);
    const A = "A".charCodeAt(0);

    if (a <= code && code <= z) {
        return code - a + 1;
    } else {
        return code - A + 27;
    }
}

export function part1(input: string): number {
    const rs = parseInput(input);
    const ps = rs.map(findCommonItem).map(priority);
    return sum(ps);
}

export function part2(input: string): number {
    return 0;
}