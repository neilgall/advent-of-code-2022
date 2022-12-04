export type Range = {
    min: number;
    max: number;
};

export type Pair = {
    range1: Range;
    range2: Range;
};

export function parseRange(input: string): Range | undefined {
    const m = /(\d+)\-(\d+)/.exec(input);
    if (m) {
        return {
            min: Number(m[1]),
            max: Number(m[2])
        };
    }
}

export function parsePair(input: string): Pair | undefined {
    const [range1, range2] = input.split(",").map(parseRange);
    if (range1 && range2) {
        return { range1, range2 };
    }
}

export function parseInput(input: string): Pair[] {
    return input.split("\n")
        .map(parsePair)
        .filter((pair) => pair) as Pair[];
}

export function rangesOverlapCompletely({ range1, range2 }: Pair): boolean {
    return (range1.min <= range2.min && range2.max <= range1.max)
        || (range2.min <= range1.min && range1.max <= range2.max);
}

export function rangesOverlap({ range1, range2 }: Pair): boolean {
    return (range1.min <= range2.min && range2.min <= range1.max)
        || (range1.min <= range2.max && range2.max <= range1.max)
        || (range2.min <= range1.min && range1.min <= range2.max)
        || (range2.min <= range1.max && range1.max <= range2.max);
}

export function part1(input: string): number {
    const pairs = parseInput(input);
    return pairs.filter(rangesOverlapCompletely).length;
}

export function part2(input: string): number {
    const pairs = parseInput(input);
    return pairs.filter(rangesOverlap).length;
}