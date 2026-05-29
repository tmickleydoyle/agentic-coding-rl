export interface CSVOptions {
  delimiter?: string;
}

export function parseCSV(text: string, opts?: CSVOptions): string[][] {
  // TODO: implement an RFC-4180-ish CSV parser
  void text;
  void opts;
  throw new Error('not implemented');
}
