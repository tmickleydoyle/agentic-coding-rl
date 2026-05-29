import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Table from '../components/Table'
import type { Person } from '../components/types'

const ROWS: Person[] = [
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Carol', age: 40 },
  { id: 4, name: 'Dave', age: 22 },
  { id: 5, name: 'Eve', age: 35 },
  { id: 6, name: 'Frank', age: 28 },
  { id: 7, name: 'Alex', age: 50 },
]

function visibleRowIds(): string[] {
  return screen.getAllByTestId(/^row-/).map((tr) => tr.getAttribute('data-testid')!)
}

describe('Filter/sort/paginate table', () => {
  it('shows the first page (3 rows) sorted by name asc by default', () => {
    render(<Table rows={ROWS} />)
    // name asc: Alex, Alice, Bob, Carol, Dave, Eve, Frank
    expect(visibleRowIds()).toEqual(['row-7', 'row-1', 'row-2'])
    expect(screen.getByTestId('page-info')).toHaveTextContent('1 / 3')
  })

  it('Next/Prev paginate through the rows', async () => {
    const user = userEvent.setup()
    render(<Table rows={ROWS} />)
    await user.click(screen.getByTestId('next'))
    expect(visibleRowIds()).toEqual(['row-3', 'row-4', 'row-5'])
    expect(screen.getByTestId('page-info')).toHaveTextContent('2 / 3')
    await user.click(screen.getByTestId('next'))
    expect(visibleRowIds()).toEqual(['row-6'])
    await user.click(screen.getByTestId('prev'))
    expect(screen.getByTestId('page-info')).toHaveTextContent('2 / 3')
  })

  it('Prev is disabled on the first page and Next on the last', async () => {
    const user = userEvent.setup()
    render(<Table rows={ROWS} />)
    expect(screen.getByTestId('prev')).toBeDisabled()
    expect(screen.getByTestId('next')).not.toBeDisabled()
    await user.click(screen.getByTestId('next'))
    await user.click(screen.getByTestId('next'))
    expect(screen.getByTestId('next')).toBeDisabled()
    expect(screen.getByTestId('prev')).not.toBeDisabled()
  })

  it('clicking a sorted header toggles asc/desc', async () => {
    const user = userEvent.setup()
    render(<Table rows={ROWS} />)
    await user.click(screen.getByTestId('sort-name')) // name is already key -> desc
    // name desc: Frank, Eve, Dave, ...
    expect(visibleRowIds()).toEqual(['row-6', 'row-5', 'row-4'])
  })

  it('sorting by age switches the key and sorts numerically asc', async () => {
    const user = userEvent.setup()
    render(<Table rows={ROWS} />)
    await user.click(screen.getByTestId('sort-age'))
    // age asc: Dave22, Bob25, Frank28, ...
    expect(visibleRowIds()).toEqual(['row-4', 'row-2', 'row-6'])
  })

  it('filtering keeps case-insensitive name substring matches', async () => {
    const user = userEvent.setup()
    render(<Table rows={ROWS} />)
    await user.type(screen.getByTestId('filter'), 'al')
    // matches Alice, Alex (name asc): Alex, Alice
    expect(visibleRowIds()).toEqual(['row-7', 'row-1'])
    expect(screen.getByTestId('page-info')).toHaveTextContent('1 / 1')
  })

  it('changing the filter resets to page 1', async () => {
    const user = userEvent.setup()
    render(<Table rows={ROWS} />)
    await user.click(screen.getByTestId('next'))
    expect(screen.getByTestId('page-info')).toHaveTextContent('2 / 3')
    await user.type(screen.getByTestId('filter'), 'a')
    expect(screen.getByTestId('page-info')).toHaveTextContent(/^1 \//)
  })
})
