import CallableInstance from "callable-instance";

export class ParseOk<T> {
    public readonly ok: true = true;
    constructor(
        public readonly value: T,
        public readonly rest: string
    ) {}

    public map<U>(f: (t: T) => U): ParseOk<U> {
        return new ParseOk(f(this.value), this.rest);
    }

    public toString(): string {
        return `Ok[${this.value}, "${this.rest}"]`;
    }
};

export class ParseErr {
    public readonly ok: false = false;
    constructor(
        public readonly expected: string,
        public readonly at: string
    ) {}

    public map(_: (t: any) => any): ParseErr {
        return new ParseErr(this.expected, this.at);
    }

    public toString(): string {
        return `Err["${this.expected}", "${this.at}"]`;
    }
};

export type Parsed<T> = ParseOk<T> | ParseErr;

export class Parser<T> {
    constructor(public readonly parse: (s: string) => Parsed<T>) {}

    public or(p2: Parser<T>): Parser<T> {
        return new Parser(
            (s: string) => {
                const r1 = this.parse(s);
                if (r1.ok) return r1;
                const r2 = p2.parse(s);
                if (r2.ok) return r2;
                return new ParseErr(`${r1.expected} or ${r2.expected}`, s);
            }
        );
    }

    public then<U>(p2: Parser<U>): Parser<[T, U]> {
        return new Parser(
            (s: string) => {
                const r1 = this.parse(s);
                if (!r1.ok) return r1 as Parsed<[T, U]>;
                const r2 = p2.parse(r1.rest);
                if (!r2.ok) return r2 as Parsed<[T, U]>;
                return new ParseOk([r1.value, r2.value], r2.rest);
            }
        );
    }

    public map<U>(f: (t: T) => U): Parser<U> {
        return new Parser(
            (s: string) => {
                const r = this.parse(s);
                return r.ok
                    ? new ParseOk(f(r.value), r. rest)
                    : r as Parsed<U>;
            }
        );
    }

    public means<U>(v: U): Parser<U> {
        return this.map(() => v);
    }

    public followedBy<U>(p: Parser<U>): Parser<T> {
        return this.then(p).map(([t, _]) => t);
    }

    public after<U>(p: Parser<U>): Parser<T> {
        return p.then(this).map(([_, t]) => t);
    }

    public between<X, Y>(x: Parser<X>, y: Parser<Y>): Parser<T> {
        return this.after(x).followedBy(y);
    }

    public many(): Parser<T[]> {
        return new Parser(
            (s: string) => {
                let r = this.parse(s);
                if (!r.ok) {
                    return r as Parsed<T[]>;
                }
                const rs = [r.value];
                let rest = r.rest;
                while (true) {
                    r = this.parse(rest)
                    if (r.ok) {
                        rs.push(r.value);
                        rest = r.rest;
                    } else {
                        break;
                    }
                }
                return new ParseOk(rs, rest);
            }
        );
    }


    public sepBy<S>(sep: Parser<S>): Parser<T[]> {
        return new Parser(
            (s: string) => {
                let r = this.parse(s);
                if (!r.ok) {
                    return r as Parsed<T[]>;
                }
                const rs = [r.value];
                let q = sep.parse(r.rest);
                if (!q.ok) {
                    return new ParseOk(rs, r.rest);
                }
                let rest = q.rest;
                while (true) {
                    r = this.parse(rest);
                    if (!r.ok) {
                        return r as Parsed<T[]>;
                    }
                    rs.push(r.value);
                    rest = r.rest;
                    q = sep.parse(rest);
                    if (!q.ok) {
                        break;
                    }
                    rest = q.rest;
                }
                return new ParseOk(rs, rest);
            }
        );
    }
        
}

export const integer: Parser<number> = new Parser(
    (s: string) => {
        const m = /^(\d+)/m.exec(s);
        return m 
            ? new ParseOk(Number(m[1]), s.substring(m[1].length)) 
            : new ParseErr("integer", s);
    }
);

export const word: Parser<string> = new Parser(
    (s: string) => {
        const m = /^([a-zA-Z]+)/.exec(s);
        return m
            ? new ParseOk(m[1], s.substring(m[1].length))
            : new ParseErr("word", s);
    }
);

export const whitespace: Parser<void> = new Parser(
    (s: string) => {
        const m = /^(\s*)/.exec(s);
        return m
            ? new ParseOk(undefined, s.substring(m[1].length))
            : new ParseErr("whitespace", s);
    }
);

export function literal(lit: string): Parser<void> {
    return new Parser(
        (s: string) => s.startsWith(lit)
            ? new ParseOk(undefined, s.substring(lit.length))
            : new ParseErr(`"${lit}"`, s)
    );
}

export function anyOf<T>(...ps: Parser<T>[]): Parser<T> {
    return ps.reduce((p1, p2) => p1.or(p2));
}

export function triple<P1, P2, P3, R>(
    p1: Parser<P1>,
    p2: Parser<P2>,
    p3: Parser<P3>,
    f: (r1: P1, r2: P2, r3: P3) => R
): Parser<R> {
    return p1.then(p2).then(p3).map(([[r1, r2], r3]) => f(r1, r2, r3));
}

export function quad<P1, P2, P3, P4, R>(
    p1: Parser<P1>,
    p2: Parser<P2>,
    p3: Parser<P3>,
    p4: Parser<P4>,
    f: (r1: P1, r2: P2, r3: P3, r4: P4) => R
): Parser<R> {
    return p1.then(p2).then(p3).then(p4).map(([[[r1, r2], r3], r4]) => f(r1, r2, r3, r4));
}
