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

export function execute(program: Instr[]): Result {
  // TODO: implement
  void program;
  throw new Error('not implemented');
}
