import {
    number,
    literal,
    whitespace,
    anyOf,
    triple,
    Parser,
    ParserRef
} from "../lib/parser";

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


export function part1(input: string): number {
    return 0;
}

export function part2(input: string): number {
    return 0;
} 