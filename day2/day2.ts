import { readFileSync } from "fs";

export enum Move {
    Rock = 1,
    Paper = 2,
    Scissors = 3
};

export enum Result {
    Lose = 0,
    Draw = 3,
    Win = 6
};

export type Round = {
    opponent: Move;
    you: Move;
};

type StrategyGuide = Round[];

function sum(ns: number[]): number {
    return ns.reduce((s, n) => s + n);
}

function playRound(round: Round): Result {
    if (round.you === round.opponent) {
        return Result.Draw;
    }
    switch (round.you) {
        case Move.Rock:
            return (round.opponent === Move.Paper) 
                ? Result.Lose 
                : Result.Win;
        case Move.Paper:
            return (round.opponent === Move.Scissors)
                ? Result.Lose
                : Result.Win;
        case Move.Scissors:
            return (round.opponent === Move.Rock)
                ? Result.Lose
                : Result.Win;
    }
}

export function score(round: Round): number {
    return round.you + playRound(round);
}

export function parseInput(input: string): StrategyGuide {
    const decode: Record<string, Move> = {
        "A": Move.Rock,
        "B": Move.Paper,
        "C": Move.Scissors,
        "X": Move.Rock,
        "Y": Move.Paper,
        "Z": Move.Scissors
    };

    const lines = input.trim().split("\n");
    return lines.map((line) => {
        const [opponent, you] = line.split(" ")
            .map((m) => decode[m]);
        return { opponent, you };
    });
}

export function part1(strategy: StrategyGuide): number {
    return sum(strategy.map(score));
}

export function part2(strategy: StrategyGuide): number {
    return 0;
}

const input = readFileSync("input.txt", "utf8").toString();
const strategy = parseInput(input);

console.log(`Part 1: ${part1(strategy)}`);
console.log(`Part 2: ${part2(strategy)}`);
