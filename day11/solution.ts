import { 
    number,
    bigInt,
    word,
    literal,
    whitespace,
    triple,
    quad,
    anyOf,
    Parser,
    Parsed
} from "../lib/parser";

export type WorryLevel = number;

export type Term = {
    type: "lit";
    value: WorryLevel;
} | {
    type: "var";
    name: string;
};

export type Expr = {
    type: "term";
    term: Term;
} | {
    type: "+" | "-" | "*";
    lhs: Expr;
    rhs: Expr;
};

export type Cond = {
    type: "div";
    by: WorryLevel;
    ifTrue: number;
    ifFalse: number;
};

export type Monkey = {
    id: number;
    items: WorryLevel[];
    operation: Expr;
    condition: Cond;
};

function match(r: RegExp, s: string): string[] | undefined {
    const gs = r.exec(s)?.groups;
    return !!gs ? Object.values(gs) : undefined;
}

export function parseInput(input: string): Monkey[] {
    const monkey: Parser<number> = 
        number.between(literal("Monkey "), literal(":"))
            .followedBy(whitespace);

    const items: Parser<WorryLevel[]> = 
        number.sepBy(literal(", "))
            .between(literal("Starting items: "), whitespace);

    const term: Parser<Term> = anyOf(
        word.map((w): Term => ({ type: "var", name: w })),
        number.map((i) => ({ type: "lit", value: i }))
    );

    const operator: Parser<"+" | "-" | "*"> = anyOf(
        literal("+").means("+"),
        literal("-").means("-"),
        literal("*").means("*"),
    );
    const expr: Parser<Expr> = anyOf(
        triple(
            // no nested expressions yet
            term.followedBy(whitespace),
            operator.followedBy(whitespace),
            term,
            (lhs, type, rhs): Expr => ({ 
                type, 
                lhs: { type: "term", term: lhs },
                rhs: { type: "term", term: rhs }
            })
        ),
        term.map((t): Expr => ({ type: "term", term: t }))
    );
    const operation: Parser<Expr> = expr.after(literal("Operation: new = "));
    const conditionTest = number.after(literal("Test: divisible by "));
    const ifTrue = number.after(literal("If true: throw to monkey "));
    const ifFalse = number.after(literal("If false: throw to monkey "));

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
        (id, items, operation, condition) => 
            ({ id, items, operation, condition })
    );

    const monkeys: Parsed<Monkey[]> = fullMonkey.many().parse(input.trim());
    if (!monkeys.ok)
        throw new Error(`Parse error: expected ${monkeys.expected} at "${monkeys.at}"`);
    return monkeys.value.sort((a, b) => a.id - b.id);
}

export type Bindings = {
    [name: string]: WorryLevel;
}

export function applyExpr(vars: Bindings, expr: Expr): WorryLevel {
    switch (expr.type) {
        case "term":
            switch (expr.term.type) {
                case "lit":
                    return expr.term.value;
                case "var":
                    return vars[expr.term.name];
            }

        case "+":
            return applyExpr(vars, expr.lhs) + applyExpr(vars, expr.rhs);

        case "-":
            return applyExpr(vars, expr.lhs) - applyExpr(vars, expr.rhs);
        
        case "*":
            return applyExpr(vars, expr.lhs) * applyExpr(vars, expr.rhs);
    }
}

export function applyCond(level: WorryLevel, cond: Cond): number {
    switch (cond.type) {
        case "div":
            return level % cond.by === 0 ? cond.ifTrue : cond.ifFalse;
    }
}

export function calculateMod(monkeys: Monkey[]): WorryLevel {
    return monkeys.map((m) => m.condition.by).reduce((a, b) => a * b);
}

export type WorryReducer = (w: WorryLevel) => WorryLevel;
export type Inspections = number[];

export function iterateMonkeys(monkeys: Monkey[], rounds: number, reducer: WorryReducer): Inspections {
    const inspections: number[] = [];
    for (let round = 0; round < rounds; ++round) {
        for (const monkey of monkeys) {
            for (const item of monkey.items) {
                const newWorry = reducer(applyExpr({ old: item }, monkey.operation));
                const toMonkey = applyCond(newWorry, monkey.condition);
                monkeys[toMonkey].items.push(newWorry);
                inspections[monkey.id] = (inspections[monkey.id] || 0) + 1;
            }
            monkey.items = [];
        }
    }
    return inspections;
}

export function part1Reducer(w: WorryLevel): WorryLevel {
    return Math.floor(w / 3);
}

export function part2Reducer(monkeys: Monkey[]): WorryReducer {
    const mod = calculateMod(monkeys);
    return (w) => w % mod;
}

export function part1(input: string): number {
    const monkeys = parseInput(input);
    const inspections = iterateMonkeys(monkeys, 20, part1Reducer);
    const mostActive = inspections.sort((a, b) => a > b ? -1 : 1);
    return mostActive[0] * mostActive[1];
}

export function part2(input: string): number {
    const monkeys = parseInput(input);
    const inspections = iterateMonkeys(monkeys, 10_000, part2Reducer(monkeys));
    const mostActive = inspections.sort((a, b) => a > b ? -1 : 1);
    return mostActive[0] * mostActive[1];
}