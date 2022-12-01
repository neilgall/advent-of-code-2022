import { readFileSync } from "fs";

function sum(ns: number[]): number {
    return ns.reduce((s, n) => s + n);
}

export function parseInput(input: string): number[] {
    const groups = input.split("\n\n");
    return groups.map((g) => 
        sum(g.split("\n").map((line) => +line))
    );
}

export function part1(elves: number[]): number {
    return Math.max(...elves);
}

export function part2(elves: number[]): number {
    const sorted = elves.sort((n1, n2) => n2 - n1);
    return sum(sorted.slice(0, 3));
}

const input = readFileSync("input.txt", "utf8").toString();
const elves = parseInput(input);

console.log(`Part 1: ${part1(elves)}`);
console.log(`Part 2: ${part2(elves)}`);
