function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

export class Fraction {
  readonly num: number;
  readonly den: number;

  constructor(num: number, den: number = 1) {
    if (!Number.isInteger(num) || !Number.isInteger(den)) {
      throw new Error('Fraction requires integer numerator and denominator');
    }
    if (den === 0) {
      throw new Error('denominator cannot be zero');
    }
    if (num === 0) {
      this.num = 0;
      this.den = 1;
      return;
    }
    let sign = 1;
    if (num < 0) sign = -sign;
    if (den < 0) sign = -sign;
    const a = Math.abs(num);
    const b = Math.abs(den);
    const g = gcd(a, b);
    this.num = sign * (a / g);
    this.den = b / g;
  }

  add(other: Fraction): Fraction {
    return new Fraction(this.num * other.den + other.num * this.den, this.den * other.den);
  }

  sub(other: Fraction): Fraction {
    return new Fraction(this.num * other.den - other.num * this.den, this.den * other.den);
  }

  mul(other: Fraction): Fraction {
    return new Fraction(this.num * other.num, this.den * other.den);
  }

  div(other: Fraction): Fraction {
    if (other.num === 0) {
      throw new Error('division by zero');
    }
    return new Fraction(this.num * other.den, this.den * other.num);
  }

  equals(other: Fraction): boolean {
    return this.num === other.num && this.den === other.den;
  }

  toString(): string {
    if (this.den === 1) return String(this.num);
    return `${this.num}/${this.den}`;
  }

  valueOf(): number {
    return this.num / this.den;
  }
}
