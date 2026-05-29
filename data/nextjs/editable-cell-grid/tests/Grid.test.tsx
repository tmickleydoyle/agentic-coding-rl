import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Grid from '../components/Grid'

const INITIAL = [
  ['a', 'b'],
  ['c', 'd'],
]

const cell = (r: number, c: number) => screen.getByTestId(`cell-${r}-${c}`)

describe('Editable cell grid', () => {
  it('renders all cell values as text initially', () => {
    render(<Grid initial={INITIAL} />)
    expect(cell(0, 0)).toHaveTextContent('a')
    expect(cell(1, 1)).toHaveTextContent('d')
    expect(screen.queryByTestId('cell-input')).toBeNull()
  })

  it('double-click turns a cell into an input', async () => {
    const user = userEvent.setup()
    render(<Grid initial={INITIAL} />)
    await user.dblClick(within(cell(0, 0)).getByTestId('cell-text'))
    const input = within(cell(0, 0)).getByTestId('cell-input') as HTMLInputElement
    expect(input).toBeInTheDocument()
    expect(input.value).toBe('a')
  })

  it('Enter commits the new value', async () => {
    const user = userEvent.setup()
    render(<Grid initial={INITIAL} />)
    await user.dblClick(within(cell(0, 1)).getByTestId('cell-text'))
    const input = within(cell(0, 1)).getByTestId('cell-input')
    await user.clear(input)
    await user.type(input, 'ZZ{Enter}')
    expect(cell(0, 1)).toHaveTextContent('ZZ')
    expect(screen.queryByTestId('cell-input')).toBeNull()
  })

  it('Escape cancels without changing the value', async () => {
    const user = userEvent.setup()
    render(<Grid initial={INITIAL} />)
    await user.dblClick(within(cell(1, 0)).getByTestId('cell-text'))
    const input = within(cell(1, 0)).getByTestId('cell-input')
    await user.clear(input)
    await user.type(input, 'nope{Escape}')
    expect(cell(1, 0)).toHaveTextContent('c')
    expect(screen.queryByTestId('cell-input')).toBeNull()
  })

  it('only one cell is editable at a time', async () => {
    const user = userEvent.setup()
    render(<Grid initial={INITIAL} />)
    await user.dblClick(within(cell(0, 0)).getByTestId('cell-text'))
    expect(screen.getAllByTestId('cell-input')).toHaveLength(1)
    await user.dblClick(within(cell(1, 1)).getByTestId('cell-text'))
    expect(screen.getAllByTestId('cell-input')).toHaveLength(1)
    // the input is now in cell 1-1, not 0-0
    expect(within(cell(1, 1)).queryByTestId('cell-input')).toBeInTheDocument()
    expect(within(cell(0, 0)).queryByTestId('cell-input')).toBeNull()
  })

  it('editing one cell leaves others unchanged', async () => {
    const user = userEvent.setup()
    render(<Grid initial={INITIAL} />)
    await user.dblClick(within(cell(0, 0)).getByTestId('cell-text'))
    const input = within(cell(0, 0)).getByTestId('cell-input')
    await user.clear(input)
    await user.type(input, 'X{Enter}')
    expect(cell(0, 0)).toHaveTextContent('X')
    expect(cell(0, 1)).toHaveTextContent('b')
    expect(cell(1, 0)).toHaveTextContent('c')
    expect(cell(1, 1)).toHaveTextContent('d')
  })

  it('re-editing a committed cell seeds the input with the new value', async () => {
    const user = userEvent.setup()
    render(<Grid initial={INITIAL} />)
    await user.dblClick(within(cell(0, 0)).getByTestId('cell-text'))
    let input = within(cell(0, 0)).getByTestId('cell-input')
    await user.clear(input)
    await user.type(input, 'hello{Enter}')
    await user.dblClick(within(cell(0, 0)).getByTestId('cell-text'))
    input = within(cell(0, 0)).getByTestId('cell-input')
    expect((input as HTMLInputElement).value).toBe('hello')
  })
})
