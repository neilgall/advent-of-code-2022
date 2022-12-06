export function hasDuplicateChars(s: string): boolean {
    return new Set(s.split("")).size < s.length;
}

export function part1(input: string): number | undefined {
    for (let i = 4; i < input.length; ++i) {
        const s = input.substring(i - 4, i);
        if (!hasDuplicateChars(s)) {
            return i;
        }
    }
}

export function part2(input: string): number {
    return 0;
}