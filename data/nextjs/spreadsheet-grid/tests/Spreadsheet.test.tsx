import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Spreadsheet from '../components/Spreadsheet'
import { parseFormula, evaluate, computeAll } from '../lib/engine'
import type { Cells } from '../lib/engine'

function val(id: string): string {
  return screen.getByTestId(`value-${id}`).textContent ?? ''
}
async function setInput(user: ReturnType<typeof userEvent.setup>, id: string, text: string) {
  const input = screen.getByTestId(`input-${id}`)
  await user.clear(input)
  if (text) await user.type(input, text)
}

describe('Spreadsheet formula engine (pure)', () => {
  it('parseFormula parses signed cell-ref terms', () => {
    expect(parseFormula('=A1+B2')).toEqual({
      refs: ['A1', 'B2'],
      tokens: [
        { ref: 'A1', sign: 1 },
        { ref: 'B2', sign: 1 },
      ],
    })
    const p = parseFormula('=A1-A2-A3')
    expect(p?.tokens).toEqual([
      { ref: 'A1', sign: 1 },
      { ref: 'A2', sign: -1 },
      { ref: 'A3', sign: -1 },
    ])
  })

  it('parseFormula rejects non-formulas and bad grammar', () => {
    expect(parseFormula('12')).toBeNull() // no '='
    expect(parseFormula('=')).toBeNull() // empty body
    expect(parseFormula('=A1+5')).toBeNull() // number literal operand
    expect(parseFormula('=A1+')).toBeNull() // trailing operator
    expect(parseFormula('=Z9')).toBeNull() // out-of-grammar ref
  })

  it('evaluate handles literals, blanks, and formulas', () => {
    const cells: Cells = { A1: '10', A2: '5', B1: '=A1+A2', B2: '=A1-A2' }
    expect(evaluate(cells, 'A1')).toBe(10)
    expect(evaluate(cells, 'C3')).toBe(0) // blank -> 0
    expect(evaluate(cells, 'B1')).toBe(15)
    expect(evaluate(cells, 'B2')).toBe(5)
  })

  it('evaluate returns null for bad refs and non-numeric literals', () => {
    expect(evaluate({ A1: 'hello' }, 'A1')).toBeNull()
    expect(evaluate({ A1: '=A1+xx' }, 'A1')).toBeNull()
  })

  it('evaluate detects direct and indirect cycles', () => {
    expect(evaluate({ A1: '=A1' }, 'A1')).toBeNull()
    const cyc: Cells = { A1: '=B1', B1: '=A1' }
    expect(evaluate(cyc, 'A1')).toBeNull()
    expect(evaluate(cyc, 'B1')).toBeNull()
  })

  it('computeAll computes every cell A1..C3', () => {
    const out = computeAll({ A1: '2', A2: '3', A3: '=A1+A2' })
    expect(out.A3).toBe(5)
    expect(out.C3).toBe(0)
    expect(Object.keys(out)).toHaveLength(9)
  })
})

describe('Spreadsheet component', () => {
  it('renders all 9 cells with initial computed values', () => {
    render(<Spreadsheet initial={{ A1: '4', A2: '6', A3: '=A1+A2' }} />)
    expect(val('A1')).toBe('4')
    expect(val('A3')).toBe('10')
    expect(val('C3')).toBe('0')
  })

  it('editing a cell recomputes its dependents live', async () => {
    const user = userEvent.setup()
    render(<Spreadsheet initial={{ A1: '1', A2: '2', B1: '=A1+A2' }} />)
    expect(val('B1')).toBe('3')
    await setInput(user, 'A1', '10')
    expect(val('B1')).toBe('12')
  })

  it('propagates through a chain of dependents', async () => {
    const user = userEvent.setup()
    render(<Spreadsheet initial={{ A1: '1', A2: '=A1+A1', A3: '=A2+A1' }} />)
    expect(val('A2')).toBe('2')
    expect(val('A3')).toBe('3')
    await setInput(user, 'A1', '5')
    expect(val('A2')).toBe('10')
    expect(val('A3')).toBe('15')
  })

  it('shows #ERR for a bad operand and clears it when fixed', async () => {
    const user = userEvent.setup()
    render(<Spreadsheet initial={{ A1: 'oops', B1: '=A1+A2' }} />)
    expect(val('A1')).toBe('#ERR')
    expect(val('B1')).toBe('#ERR')
    await setInput(user, 'A1', '7')
    expect(val('A1')).toBe('7')
    expect(val('B1')).toBe('7')
  })

  it('shows #ERR when an edit introduces a cycle', async () => {
    const user = userEvent.setup()
    render(<Spreadsheet initial={{ A1: '1', A2: '=A1' }} />)
    expect(val('A2')).toBe('1')
    await setInput(user, 'A1', '=A2')
    expect(val('A1')).toBe('#ERR')
    expect(val('A2')).toBe('#ERR')
  })
})
