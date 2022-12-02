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

export type Round1 = {
    opponent: Move;
    you: Move;
};

export type Round2 = {
    opponent: Move;
    result: Result;
};

type StrategyGuide1 = Round1[];
type StrategyGuide2 = Round2[];

function sum(ns: number[]): number {
    return ns.reduce((s, n) => s + n);
}

function playRound1(round: Round1): Result {
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

function playRound2(round: Round2): Move {
    if (round.result === Result.Draw) {
        return round.opponent;
    }
    switch (round.opponent) {
        case Move.Rock:
            return (round.result === Result.Win) 
                ? Move.Paper
                : Move.Scissors;
        case Move.Paper:
            return (round.result === Result.Win)
                ? Move.Scissors
                : Move.Rock;
        case Move.Scissors:
            return (round.result === Result.Win)
                ? Move.Rock
                : Move.Paper;
    }
}

export function score1(round: Round1): number {
    return round.you + playRound1(round);
}

export function score2(round: Round2): number {
    return round.result + playRound2(round);
}

export function parseInput1(input: string): StrategyGuide1 {
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

export function parseInput2(input: string): StrategyGuide2 {
    const decodeMove: Record<string, Move> = {
        "A": Move.Rock,
        "B": Move.Paper,
        "C": Move.Scissors,
    };
    const decodeResult: Record<string, Result> = {
        "X": Result.Lose,
        "Y": Result.Draw,
        "Z": Result.Win,
    };

    const lines = input.trim().split("\n");
    return lines.map((line) => {
        const [opponent, result] = line.split(" ");
        return { 
            opponent: decodeMove[opponent],
            result: decodeResult[result]
        };
    });
}

export function part1(strategy: StrategyGuide1): number {
    return sum(strategy.map(score1));
}

export function part2(strategy: StrategyGuide2): number {
    return sum(strategy.map(score2));
}

const input = readFileSync("input.txt", "utf8").toString();
const strategy1 = parseInput1(input);
const strategy2 = parseInput2(input);

console.log(`Part 1: ${part1(strategy1)}`);
console.log(`Part 2: ${part2(strategy2)}`);
