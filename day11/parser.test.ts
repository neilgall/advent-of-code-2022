import { integer, literal, ParseErr, ParseOk, whitespace, word, anyOf } from "./parser"

describe("integer", () => {
    it("parses ints", () => {
        expect(integer.parse("123")).toStrictEqual(new ParseOk(123, ""));
    });

    it("includes the remainer", () => {
        expect(integer.parse("123:")).toStrictEqual(new ParseOk(123, ":"));
    });

    it("rejects non-integers", () => {
        expect(integer.parse("foo")).toStrictEqual(new ParseErr("integer", "foo"));
    });
});

describe("word", () => {
    it("parses words", () => {
        expect(word.parse("foo")).toStrictEqual(new ParseOk("foo", ""));
    });

    it("includes the remainer", () => {
        expect(word.parse("foo bar")).toStrictEqual(new ParseOk("foo", " bar"));
    });

    it("rejects non-words", () => {
        expect(word.parse("123")).toStrictEqual(new ParseErr("word", "123"));
    });
});

describe("literal", () => {
    it("parses literals", () => {
        expect(literal("foo").parse("foobar")).toStrictEqual(new ParseOk(undefined, "bar"));
    });

    it("rejects other strings", () => {
        expect(literal("foo").parse("bar")).toStrictEqual(new ParseErr(`"foo"`, "bar"));
    });
});

describe("whitespace", () => {
    it("parses spaces", () => {
        expect(whitespace.parse("   foo")).toStrictEqual(new ParseOk(undefined, "foo"));
    });

    it("parses tabs", () => {
        expect(whitespace.parse("\t\tfoo")).toStrictEqual(new ParseOk(undefined, "foo"));
    });

    it("parses newlines", () => {
        expect(whitespace.parse("\n\nfoo")).toStrictEqual(new ParseOk(undefined, "foo"));
    });
});

describe("then", () => {
    const foobar = literal("foo").then(literal("bar"));
    it("parses the sequenced parts", () => {
        expect(foobar.parse("foobarbaz")).toStrictEqual(new ParseOk([undefined, undefined], "baz"));
    });

    it("rejects if the first part is wrong", () => {
        expect(foobar.parse("barbaz")).toStrictEqual(new ParseErr(`"foo"`, "barbaz"));
    });

    it("rejects if the second part is wrong", () => {
        expect(foobar.parse("foobaz")).toStrictEqual(new ParseErr(`"bar"`, "baz"));
    });
});

describe("or", () => {
    const foo_or_bar = literal("foo").or(literal("bar"));
    it("parses the first option", () => {
        expect(foo_or_bar.parse("foobar")).toStrictEqual(new ParseOk(undefined, "bar"));
    });

    it("parses the second option", () => {
        expect(foo_or_bar.parse("barfoo")).toStrictEqual(new ParseOk(undefined, "foo"));
    });
});

describe("anyOf", () => {
    const p = anyOf(
        literal("+").means("+"),
        literal("-").means("-"),
        literal("*").means("*"),
        literal("/").means("/"),
    );
    it.each(["+", "-", "*", "/"])("parses %s", (symbol) => {
        expect(p.parse(symbol)).toStrictEqual(new ParseOk(symbol, ""));
    });

    it("rejects other inputs", () => {
        expect(p.parse("$")).toStrictEqual(new ParseErr(`"+" or "-" or "*" or "/"`, "$"));
    })
});

describe("after", () => {
    const p = integer.after(literal("foo"));
    it("ignores the prefix", () => {
        expect(p.parse("foo123bar")).toStrictEqual(new ParseOk(123, "bar"));
    });

    it("rejects if the prefix is wrong", () => {
        expect(p.parse("bar123foo")).toStrictEqual(new ParseErr(`"foo"`, "bar123foo"));
    });

    it("rejects if the retained part is wrong", () => {
        expect(p.parse("foobarfoo")).toStrictEqual(new ParseErr("integer", "barfoo"));
    });
});


describe("followedBy", () => {
    const p = integer.followedBy(literal("foo"));
    it("ignores the suffix", () => {
        expect(p.parse("123foobar")).toStrictEqual(new ParseOk(123, "bar"));
    });

    it("rejects if the suffix is wrong", () => {
        expect(p.parse("123bar")).toStrictEqual(new ParseErr(`"foo"`, "bar"));
    });

    it("rejects if the retained part is wrong", () => {
        expect(p.parse("barfoo")).toStrictEqual(new ParseErr("integer", "barfoo"));
    });

    it.each(["foo   bar", "foo\t\tbar", "foo\n\n  bar"])("followedBy '%s'", (s) => {
        const p = literal("foo").followedBy(whitespace);
        expect(p.parse(s)).toStrictEqual(new ParseOk(undefined, "bar"));
    });
});

describe("between", () => {
    const p = integer.between(literal("["), literal("]"));
    it("ignores the before and after", () => {
        expect(p.parse("[123]foo")).toStrictEqual(new ParseOk(123, "foo"));
    });

    it("rejects if the prefix is wrong", () => {
        expect(p.parse("*123]")).toStrictEqual(new ParseErr(`"["`, "*123]"));
    });

    it("rejects if the suffix is wrong", () => {
        expect(p.parse("[123*")).toStrictEqual(new ParseErr(`"]"`, "*"));
    });

    it("rejects if the retained part is wrong", () => {
        expect(p.parse("[foo]")).toStrictEqual(new ParseErr("integer", "foo]"));
    });
});

describe("sepBy", () => {
    const p = integer.sepBy(literal(","));
    it.each([
        ["1,2,3,4", [1,2,3,4]],
        ["1", [1]],
    ])("parses '%s'", (input, output) => {
        expect(p.parse(input)).toStrictEqual(new ParseOk(output, ""));
    });

    it("rejects an empty list", () => {
        expect(p.parse("foo")).toStrictEqual(new ParseErr("integer", "foo"));
    });

    it("rejects an unterminated list", () => {
        expect(p.parse("1,foo")).toStrictEqual(new ParseErr("integer", "foo"));
    });

    it("complex example", () => {
        const p = integer.sepBy(literal(",").followedBy(whitespace)); //.between(literal("["), literal("]"));
        expect(p.parse("1, 2,  3,4")).toStrictEqual(new ParseOk([1,2,3,4], ""));
    });
});
