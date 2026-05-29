const TAPE_SIZE = 30000;
const STEP_CAP = 1_000_000;
const COMMANDS = '><+-.,[]';

function buildJumpTable(code: string): Map<number, number> {
  const jumps = new Map<number, number>();
  const stack: number[] = [];
  for (let i = 0; i < code.length; i++) {
    const c = code[i];
    if (c === '[') {
      stack.push(i);
    } else if (c === ']') {
      const open = stack.pop();
      if (open === undefined) throw new Error('unmatched ]');
      jumps.set(open, i);
      jumps.set(i, open);
    }
  }
  if (stack.length > 0) throw new Error('unmatched [');
  return jumps;
}

export function run(program: string, input = ''): string {
  // Strip comments so the jump table and instruction pointer align.
  let code = '';
  for (let i = 0; i < program.length; i++) {
    if (COMMANDS.indexOf(program[i]) !== -1) code += program[i];
  }

  const jumps = buildJumpTable(code);
  const tape = new Uint8Array(TAPE_SIZE);
  let ptr = 0;
  let inputPos = 0;
  let steps = 0;
  let out = '';

  let ip = 0;
  while (ip < code.length) {
    steps++;
    if (steps > STEP_CAP) throw new Error('step cap exceeded');
    const c = code[ip];
    switch (c) {
      case '>':
        ptr++;
        if (ptr >= TAPE_SIZE) throw new Error('pointer out of bounds');
        break;
      case '<':
        ptr--;
        if (ptr < 0) throw new Error('pointer out of bounds');
        break;
      case '+':
        tape[ptr] = (tape[ptr] + 1) & 0xff;
        break;
      case '-':
        tape[ptr] = (tape[ptr] - 1) & 0xff;
        break;
      case '.':
        out += String.fromCharCode(tape[ptr]);
        break;
      case ',':
        if (inputPos < input.length) {
          tape[ptr] = input.charCodeAt(inputPos) & 0xff;
          inputPos++;
        } else {
          tape[ptr] = 0;
        }
        break;
      case '[':
        if (tape[ptr] === 0) ip = jumps.get(ip) as number;
        break;
      case ']':
        if (tape[ptr] !== 0) ip = jumps.get(ip) as number;
        break;
      default:
        break;
    }
    ip++;
  }
  return out;
}
