export interface CSVOptions {
  delimiter?: string;
}

export function parseCSV(text: string, opts?: CSVOptions): string[][] {
  const delimiter = opts?.delimiter ?? ',';
  if (delimiter.length !== 1) {
    throw new Error('delimiter must be a single character');
  }
  if (text === '') return [];

  const rows: string[][] = [];
  let field = '';
  let row: string[] = [];
  let inQuotes = false;
  let i = 0;
  const n = text.length;

  function endField(): void {
    row.push(field);
    field = '';
  }
  function endRow(): void {
    endField();
    rows.push(row);
    row = [];
  }

  while (i < n) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
        } else {
          inQuotes = false;
          i++;
        }
      } else {
        field += c;
        i++;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
        i++;
      } else if (c === delimiter) {
        endField();
        i++;
      } else if (c === '\r') {
        if (text[i + 1] === '\n') {
          endRow();
          i += 2;
        } else {
          endRow();
          i++;
        }
      } else if (c === '\n') {
        endRow();
        i++;
      } else {
        field += c;
        i++;
      }
    }
  }

  // Final field/row: only push if there is pending content (i.e. the input did
  // not end exactly on a row terminator).
  if (field !== '' || row.length > 0) {
    endRow();
  }

  return rows;
}
