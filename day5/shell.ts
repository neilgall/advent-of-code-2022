import { readFileSync } from "fs";
import { part1, part2 } from "./solution";

const input = readFileSync("input.txt", "utf8").toString();

console.log(`Part 1: ${part1(input)}`);
console.log(`Part 2: ${part2(input)}`);
