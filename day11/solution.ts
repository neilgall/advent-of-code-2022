import { 
    integer,
    word,
    literal,
    whitespace,
    triple,
    quad,
    anyOf,
    Parser,
    Parsed
} from "./parser";

export type Term = {
    type: "lit";
    value: number;
} | {
    type: "var";
    name: string;
};

export type Expr = {
    type: "term";
    term: Term;
} | {
    type: "+" | "-" | "*";
    lhs: Term;
    rhs: Term;
};

export type Cond = {
    type: "div";
    by: number;
    ifTrue: number;
    ifFalse: number;
};

export type Monkey = {
    id: number;
    startingItems: number[];
    operation: Expr;
    condition: Cond;
};

function match(r: RegExp, s: string): string[] | undefined {
    const gs = r.exec(s)?.groups;
    return !!gs ? Object.values(gs) : undefined;
}

export function parseInput(input: string): Monkey[] {
    const monkey: Parser<number> = 
        integer.between(literal("Monkey "), literal(":"))
            .followedBy(whitespace);

    const items: Parser<number[]> = 
        integer.sepBy(literal(", "))
            .between(literal("Starting items: "), whitespace);

    const term: Parser<Term> = anyOf(
        word.map((w): Term => ({ type: "var", name: w })),
        integer.map((i) => ({ type: "lit", value: Number(i) }))
    );

    const operator: Parser<"+" | "-" | "*"> = anyOf(
        literal("+").means("+"),
        literal("-").means("-"),
        literal("*").means("*"),
    );
    const expr: Parser<Expr> = anyOf(
        triple(
            term.followedBy(whitespace),
            operator.followedBy(whitespace),
            term,
            (lhs, type, rhs): Expr => ({ type, lhs, rhs })
        ),
        term.map((t): Expr => ({ type: "term", term: t }))
    );
    const operation: Parser<Expr> = expr.after(literal("Operation: new = "));
    const conditionTest = integer.after(literal("Test: divisible by "));
    const ifTrue = integer.after(literal("If true: throw to monkey "));
    const ifFalse = integer.after(literal("If false: throw to monkey "));

    const condition: Parser<Cond> = triple(
        conditionTest.followedBy(whitespace),
        ifTrue.followedBy(whitespace),
        ifFalse.followedBy(whitespace),
        (by, ifTrue, ifFalse) => ({ type: "div", by, ifTrue, ifFalse })
    );

    const fullMonkey: Parser<Monkey> = quad(
        monkey.followedBy(whitespace),
        items.followedBy(whitespace),
        operation.followedBy(whitespace),
        condition.followedBy(whitespace),
        (id, startingItems, operation, condition) => 
            ({ id, startingItems, operation, condition })
    );

    const monkeys: Parsed<Monkey[]> = fullMonkey.many().parse(input.trim());
    if (!monkeys.ok)
        throw new Error(`Parse error: expected ${monkeys.expected} at "${monkeys.at}"`);
    return monkeys.value;
}

export function part1(input: string): number {
    return 0;
}

export function part2(input: string): number {
    return 0;
}