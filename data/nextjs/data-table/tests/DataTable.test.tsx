import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DataTable from '../components/DataTable'

const ROWS = [
  { id: 1, name: 'Charlie', age: 30 },
  { id: 2, name: 'Alice', age: 42 },
  { id: 3, name: 'Bob', age: 25 },
]

function rowOrder() {
  const tbody = screen.getByTestId('table').querySelector('tbody')!
  return Array.from(tbody.querySelectorAll('tr')).map(
    (tr) => tr.getAttribute('data-testid')!
  )
}

describe('DataTable', () => {
  it('defaults to sorting by name ascending', () => {
    render(<DataTable rows={ROWS} />)
    expect(rowOrder()).toEqual(['row-2', 'row-3', 'row-1'])
    expect(screen.getByTestId('sort-name')).toHaveAttribute('aria-sort', 'ascending')
    expect(screen.getByTestId('sort-age')).not.toHaveAttribute('aria-sort')
  })

  it('clicking Age sorts numerically by age', async () => {
    const user = userEvent.setup()
    render(<DataTable rows={ROWS} />)
    await user.click(within(screen.getByTestId('sort-age')).getByRole('button'))
    expect(rowOrder()).toEqual(['row-3', 'row-1', 'row-2'])
    expect(screen.getByTestId('sort-age')).toHaveAttribute('aria-sort', 'ascending')
    expect(screen.getByTestId('sort-name')).not.toHaveAttribute('aria-sort')
  })

  it('clicking Name switches back to name sort', async () => {
    const user = userEvent.setup()
    render(<DataTable rows={ROWS} />)
    await user.click(within(screen.getByTestId('sort-age')).getByRole('button'))
    await user.click(within(screen.getByTestId('sort-name')).getByRole('button'))
    expect(rowOrder()).toEqual(['row-2', 'row-3', 'row-1'])
  })

  it('row cells show name and age', () => {
    render(<DataTable rows={ROWS} />)
    const r2 = screen.getByTestId('row-2')
    expect(r2).toHaveTextContent('Alice')
    expect(r2).toHaveTextContent('42')
  })
})
