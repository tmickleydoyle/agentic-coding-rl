interface FieldRange {
  min: number;
  max: number;
}

const RANGES: FieldRange[] = [
  { min: 0, max: 59 }, // minute
  { min: 0, max: 23 }, // hour
  { min: 1, max: 31 }, // day of month
  { min: 1, max: 12 }, // month
  { min: 0, max: 6 }, // day of week
];

function parseField(field: string, range: FieldRange): Set<number> {
  const values = new Set<number>();
  const parts = field.split(',');
  parts.forEach((part) => {
    if (part === '') throw new Error(`empty field part in "${field}"`);
    let step = 1;
    let body = part;
    const slash = part.indexOf('/');
    if (slash !== -1) {
      body = part.slice(0, slash);
      const stepStr = part.slice(slash + 1);
      step = Number(stepStr);
      if (!Number.isInteger(step) || step <= 0) {
        throw new Error(`invalid step in "${part}"`);
      }
    }

    let start: number;
    let end: number;
    if (body === '*') {
      start = range.min;
      end = range.max;
    } else if (body.indexOf('-') !== -1) {
      const [a, b] = body.split('-');
      start = Number(a);
      end = Number(b);
      if (!Number.isInteger(start) || !Number.isInteger(end)) {
        throw new Error(`invalid range "${body}"`);
      }
    } else {
      start = Number(body);
      end = start;
      if (!Number.isInteger(start)) throw new Error(`invalid value "${body}"`);
    }

    if (start < range.min || end > range.max || start > end) {
      throw new Error(`field value out of range: "${part}"`);
    }
    for (let v = start; v <= end; v += step) {
      values.add(v);
    }
  });
  return values;
}

interface Parsed {
  minute: Set<number>;
  hour: Set<number>;
  dom: Set<number>;
  month: Set<number>;
  dow: Set<number>;
  domStar: boolean;
  dowStar: boolean;
}

function parseCron(expr: string): Parsed {
  const fields = expr.trim().split(/\s+/);
  if (fields.length !== 5) {
    throw new Error(`expected 5 fields, got ${fields.length}`);
  }
  return {
    minute: parseField(fields[0], RANGES[0]),
    hour: parseField(fields[1], RANGES[1]),
    dom: parseField(fields[2], RANGES[2]),
    month: parseField(fields[3], RANGES[3]),
    dow: parseField(fields[4], RANGES[4]),
    domStar: fields[2] === '*',
    dowStar: fields[4] === '*',
  };
}

export function matches(cronExpr: string, date: Date): boolean {
  const p = parseCron(cronExpr);
  const min = date.getMinutes();
  const hr = date.getHours();
  const dom = date.getDate();
  const mon = date.getMonth() + 1;
  const dow = date.getDay();

  if (!p.minute.has(min)) return false;
  if (!p.hour.has(hr)) return false;
  if (!p.month.has(mon)) return false;

  const domMatch = p.dom.has(dom);
  const dowMatch = p.dow.has(dow);

  if (!p.domStar && !p.dowStar) {
    return domMatch || dowMatch;
  }
  if (!p.domStar) return domMatch;
  if (!p.dowStar) return dowMatch;
  return true;
}

export function describe(cronExpr: string): string {
  const fields = cronExpr.trim().split(/\s+/);
  if (fields.length !== 5) throw new Error('expected 5 fields');
  if (fields.every((f) => f === '*')) return 'Every minute';
  const parts: string[] = [];
  if (fields[0] !== '*') parts.push(`at minute ${fields[0]}`);
  if (fields[1] !== '*') parts.push(`at hour ${fields[1]}`);
  if (fields[2] !== '*') parts.push(`on day-of-month ${fields[2]}`);
  if (fields[3] !== '*') parts.push(`in month ${fields[3]}`);
  if (fields[4] !== '*') parts.push(`on day-of-week ${fields[4]}`);
  return parts.join(', ');
}
