import { sum, collect } from "./utils";

export type Instruction = {
    type: "addx";
    arg: number;
} | {
    type: "noop";
};

export function parseInput(input: string): Instruction[] {
    return input.trim().split("\n").map((line) => {
        const words = line.split(" ");
        switch (words[0]) {
            case "addx": return {
                type: "addx",
                arg: Number(words[1])
            };
            case "noop": return {
                type: "noop"
            };
            default:
                throw new Error(`cannot parse ${line}`);
        }
    });
}

export function* signalStrength(instrs: Instruction[]): Generator<number> {
    const machine = {
        x: 1,
        nextx: 1,
        cycles: 0,
        current: 0
    };
    let ip = 0;
    while (ip < instrs.length || machine.current > 0) {
        if (machine.current === 0) {
            machine.x = machine.nextx;
            const i = instrs[ip];
            switch (i.type) {
                case "noop":
                    machine.nextx = machine.x;
                    machine.current = 1;
                    break;
                case "addx":
                    machine.nextx = machine.x + i.arg;
                    machine.current = 2;
                    break;
            }
            ip++;
        }
        machine.cycles++;
        machine.current--;
        if ((machine.cycles + 20) % 40 === 0) {
            yield machine.x * machine.cycles;
        }
    }
}

export function* display(instrs: Instruction[]): Generator<string> {
    const machine = {
        x: 1,
        nextx: 1,
        cycles: 0,
        current: 0
    };
    let ip = 0;
    let row = "";
    while (ip < instrs.length || machine.current > 0) {
        if (machine.current === 0) {
            machine.x = machine.nextx;
            const i = instrs[ip];
            switch (i.type) {
                case "noop":
                    machine.nextx = machine.x;
                    machine.current = 1;
                    break;
                case "addx":
                    machine.nextx = machine.x + i.arg;
                    machine.current = 2;
                    break;
            }
            ip++;
        }

        row += Math.abs(machine.cycles % 40 - machine.x) < 2 ? "#" : ".";

        machine.cycles++;
        machine.current--;

        if (machine.cycles % 40 === 0) {
            yield row;
            row = "";
        }
    }

}

export function part1(input: string): number {
    const instructions = parseInput(input);
    const strengths = collect(signalStrength(instructions));
    return sum(strengths);
}

export function part2(input: string): string {
    const instructions = parseInput(input);
    const lines = collect(display(instructions));
    return lines.join("\n");
}
 