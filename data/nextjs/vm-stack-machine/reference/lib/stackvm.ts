export type Instr =
  | { op: 'PUSH'; value: number }
  | { op: 'ADD' }
  | { op: 'SUB' }
  | { op: 'MUL' }
  | { op: 'DIV' }
  | { op: 'DUP' }
  | { op: 'SWAP' }
  | { op: 'PRINT' }
  | { op: 'JZ'; label: string }
  | { op: 'JMP'; label: string }
  | { op: 'LABEL'; name: string }
  | { op: 'HALT' };

export interface Result {
  top: number | null;
  output: number[];
}

const STEP_CAP = 1_000_000;

export function execute(program: Instr[]): Result {
  const labels = new Map<string, number>();
  for (let i = 0; i < program.length; i++) {
    const ins = program[i];
    if (ins.op === 'LABEL') labels.set(ins.name, i);
  }

  const resolve = (label: string): number => {
    const target = labels.get(label);
    if (target === undefined) throw new Error(`unknown label: ${label}`);
    return target;
  };

  const stack: number[] = [];
  const output: number[] = [];
  const pop = (): number => {
    if (stack.length === 0) throw new Error('stack underflow');
    return stack.pop() as number;
  };

  let ip = 0;
  let steps = 0;
  while (ip < program.length) {
    if (++steps > STEP_CAP) throw new Error('step cap exceeded');
    const ins = program[ip];
    switch (ins.op) {
      case 'PUSH':
        stack.push(ins.value);
        break;
      case 'ADD': {
        const b = pop();
        const a = pop();
        stack.push(a + b);
        break;
      }
      case 'SUB': {
        const b = pop();
        const a = pop();
        stack.push(a - b);
        break;
      }
      case 'MUL': {
        const b = pop();
        const a = pop();
        stack.push(a * b);
        break;
      }
      case 'DIV': {
        const b = pop();
        const a = pop();
        if (b === 0) throw new Error('division by zero');
        stack.push(a / b);
        break;
      }
      case 'DUP': {
        if (stack.length === 0) throw new Error('stack underflow');
        stack.push(stack[stack.length - 1]);
        break;
      }
      case 'SWAP': {
        if (stack.length < 2) throw new Error('stack underflow');
        const b = stack.pop() as number;
        const a = stack.pop() as number;
        stack.push(b);
        stack.push(a);
        break;
      }
      case 'PRINT':
        output.push(pop());
        break;
      case 'JZ': {
        const v = pop();
        if (v === 0) {
          ip = resolve(ins.label);
          continue;
        }
        break;
      }
      case 'JMP':
        ip = resolve(ins.label);
        continue;
      case 'LABEL':
        break;
      case 'HALT':
        return { top: stack.length ? stack[stack.length - 1] : null, output };
      default:
        break;
    }
    ip++;
  }

  return { top: stack.length ? stack[stack.length - 1] : null, output };
}
