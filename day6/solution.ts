export function hasDuplicateChars(s: string): boolean {
    return new Set(s.split("")).size < s.length;
}

export function findUniqueSubstring(s: string, len: number): number | undefined {
    for (let i = len; i < s.length; ++i) {
        const ss = s.substring(i - len, i);
        if (!hasDuplicateChars(ss)) {
            return i;
        }
    }
}

export function part1(input: string): number | undefined {
    return findUniqueSubstring(input, 4);
}

export function part2(input: string): number | undefined {
    return findUniqueSubstring(input, 14);
}