import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FieldArray from '../components/FieldArray'

function setField(i: number, v: string) {
  fireEvent.change(screen.getByTestId(`field-${i}`), { target: { value: v } })
}

function addRows(n: number) {
  for (let k = 0; k < n; k++) fireEvent.click(screen.getByTestId('add'))
}

describe('FieldArray', () => {
  it('starts with a single empty row', () => {
    render(<FieldArray />)
    expect(screen.getByTestId('field-0')).toBeInTheDocument()
    expect(screen.queryByTestId('field-1')).toBeNull()
    expect(screen.getByTestId('values')).toHaveTextContent('')
  })

  it('adds rows and edits each independently', () => {
    render(<FieldArray />)
    addRows(2)
    setField(0, 'A')
    setField(1, 'B')
    setField(2, 'C')
    expect(screen.getByTestId('values')).toHaveTextContent('A,B,C')
  })

  it('removing the last row drops only that value', () => {
    render(<FieldArray />)
    addRows(2)
    setField(0, 'A')
    setField(1, 'B')
    setField(2, 'C')
    fireEvent.click(screen.getByTestId('remove-2'))
    expect(screen.getByTestId('values')).toHaveTextContent('A,B')
  })

  it('removing a middle row keeps the other values aligned (the bug)', () => {
    render(<FieldArray />)
    addRows(2)
    setField(0, 'A')
    setField(1, 'B')
    setField(2, 'C')
    fireEvent.click(screen.getByTestId('remove-1')) // remove B
    expect(screen.getByTestId('values')).toHaveTextContent('A,C')
    expect(screen.getByTestId('field-0')).toHaveValue('A')
    expect(screen.getByTestId('field-1')).toHaveValue('C')
  })

  it('removing the first row keeps the remaining values', () => {
    render(<FieldArray />)
    addRows(2)
    setField(0, 'A')
    setField(1, 'B')
    setField(2, 'C')
    fireEvent.click(screen.getByTestId('remove-0'))
    expect(screen.getByTestId('values')).toHaveTextContent('B,C')
  })

  it('values entered after a removal stay on their own rows', () => {
    render(<FieldArray />)
    addRows(2)
    setField(0, 'A')
    setField(1, 'B')
    setField(2, 'C')
    fireEvent.click(screen.getByTestId('remove-1')) // -> A, C
    setField(1, 'Z') // edit the row that now shows C
    expect(screen.getByTestId('values')).toHaveTextContent('A,Z')
  })

  it('handles remove-then-add without resurrecting old values', () => {
    render(<FieldArray />)
    addRows(2)
    setField(0, 'A')
    setField(1, 'B')
    setField(2, 'C')
    fireEvent.click(screen.getByTestId('remove-1')) // -> A, C
    fireEvent.click(screen.getByTestId('add')) // new empty row appended
    expect(screen.getByTestId('field-2')).toHaveValue('')
    expect(screen.getByTestId('values')).toHaveTextContent('A,C,')
  })

  it('removing every row down to one still tracks values correctly', () => {
    render(<FieldArray />)
    addRows(2)
    setField(0, 'A')
    setField(1, 'B')
    setField(2, 'C')
    fireEvent.click(screen.getByTestId('remove-0')) // B, C
    fireEvent.click(screen.getByTestId('remove-0')) // C
    expect(screen.getByTestId('values')).toHaveTextContent('C')
    expect(screen.getByTestId('field-0')).toHaveValue('C')
  })
})
