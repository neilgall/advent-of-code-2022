import { sum } from "./utils";

export type Item = string;
export type Compartment = string;

export type Rucksack = {
    allItems: Compartment;
    compartment1: Compartment;
    compartment2: Compartment;
};

export type Group = {
    rucksack0: Rucksack;
    rucksack1: Rucksack;
    rucksack2: Rucksack;
};

export function parseInput(input: string): Rucksack[] {
    return input.trim().split("\n").map((line) => {
        const half = line.length / 2;
        return {
            allItems: line,
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

export function group(rs: Rucksack[]): Group[] {
    const groups = [];
    for (let i = 0; i < rs.length; i += 3) {
        groups.push({
            rucksack0: rs[i],
            rucksack1: rs[i+1],
            rucksack2: rs[i+2]
        });
    }
    return groups;
}

export function findGroupBadge(g: Group): Item {
    for (const item of g.rucksack0.allItems) {
        if (g.rucksack1.allItems.indexOf(item) < 0) continue;
        if (g.rucksack2.allItems.indexOf(item) < 0) continue;
        return item;
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
    const rs = parseInput(input);
    const ps = group(rs).map(findGroupBadge).map(priority);
    return sum(ps);
}