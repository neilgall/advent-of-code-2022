import {
    number,
    literal,
    whitespace,
    anyOf,
    triple,
    Parser,
    ParserRef
} from "../lib/parser";
import { sum } from "./utils";

export type PacketData = number | PacketData[];

export type PacketPair = [PacketData, PacketData];

export function parseInput(input: string): PacketPair[] {
    const packetData = new ParserRef<PacketData>();

    const bareNumber: Parser<PacketData> = number;
    
    const packet: Parser<PacketData> = 
        anyOf(
            bareNumber,
            literal("[]").means([]),
            packetData.get().sepBy(literal(","))
                .between(literal("["), literal("]"))
        );

    packetData.set(packet);

    const packetPair: Parser<PacketPair> =
        triple(
            packet,
            whitespace,
            packet,
            (p1, _, p2) => [p1, p2]
        );

    const parsedPairs = input.trim()
        .split("\n\n")
        .map(packetPair.parse);

    return parsedPairs.map((pp) => {
        if (pp.ok) return pp.value;
        else throw new Error(`expected ${pp.expected} at ${pp.at}`);
    });
}

export enum CompareResult {
    Ordered = -1,
    Unknown = 0,
    NotOrdered = 1,
};

export function isNumber(x: any): boolean {
    return typeof(x) === "number";
}

export function comparePacketPair(left: PacketData, right: PacketData): CompareResult {
    if (isNumber(left) && isNumber(right)) {
        if (left < right) return CompareResult.Ordered;
        else if (left > right) return CompareResult.NotOrdered;
        else return CompareResult.Unknown;
    }
    else if (isNumber(left)) {
        return comparePacketPair([left], right);
    } else if (isNumber(right)) {
        return comparePacketPair(left, [right]);
    } else {
        const l = left as PacketData[];
        const r = right as PacketData[];
        for (let i = 0; i < l.length || i < r.length; ++i) {
            if (i == r.length) {
                return CompareResult.NotOrdered;
            } else if (i == l.length) {
                return CompareResult.Ordered;
            } else {
                const c = comparePacketPair(l[i], r[i]);
                if (c !== CompareResult.Unknown) {
                    return c;
                }
            }
        }
        return CompareResult.Unknown;
    }
}

export function part1(input: string): number {
    const pairs = parseInput(input);
    return sum(pairs.map(([l, r], i) =>
        comparePacketPair(l, r) === CompareResult.Ordered ? i+1 : 0
    ));
}

export function part2(input: string): number {
    const pairs = parseInput(input);
    const packets: PacketData[] = [
        [[2]],
        [[6]],
        ...pairs.map(([l, _]) => l),
        ...pairs.map(([_, r]) => r),
    ];
    const sorted = packets.sort(comparePacketPair);
    const strs = sorted.map((p) => JSON.stringify(p));
    const two = strs.indexOf("[[2]]") + 1;
    const six = strs.indexOf("[[6]]") + 1;
    return two * six;
}
