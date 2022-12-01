import { readFileSync } from "fs";

export function parse_input(input: string): number[] {
    const elves: number[] = [];
    let current = 0;
    for (const line of input.split("\n")) {
        if (line.length == 0) {
            elves.push(current);
            current = 0;
        } else {
            current += +line;
        }
    }
    if (current > 0) {
        elves.push(current);
    }
    return elves;
}

export function part1(elves: number[]): number {
    return Math.max(...elves);
}

const input = readFileSync("input.txt", "utf8").toString();
const elves = parse_input(input);

console.log(`Part 1: ${part1(elves)}`);
