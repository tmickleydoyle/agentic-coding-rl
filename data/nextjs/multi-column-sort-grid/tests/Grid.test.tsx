import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Grid from '../components/Grid'
import { cycleSort, sortRows } from '../lib/sort'
import type { Person } from '../components/types'

const ROWS: Person[] = [
  { id: 1, name: 'Alice', age: 30, city: 'NYC' },
  { id: 2, name: 'Bob', age: 30, city: 'LA' },
  { id: 3, name: 'Carol', age: 25, city: 'NYC' },
  { id: 4, name: 'Dave', age: 25, city: 'LA' },
]

function rowOrder(): number[] {
  return screen
    .getAllByTestId(/^row-/)
    .map((tr) => Number(tr.getAttribute('data-testid')!.slice('row-'.length)))
}

describe('multi-column sort (pure)', () => {
  it('cycleSort goes absent -> asc -> desc -> removed', () => {
    let s = cycleSort([], 'name')
    expect(s).toEqual([{ key: 'name', dir: 'asc' }])
    s = cycleSort(s, 'name')
    expect(s).toEqual([{ key: 'name', dir: 'desc' }])
    s = cycleSort(s, 'name')
    expect(s).toEqual([])
  })

  it('cycleSort keeps position of existing keys and appends new ones', () => {
    const s = cycleSort(cycleSort([], 'age'), 'name')
    expect(s).toEqual([
      { key: 'age', dir: 'asc' },
      { key: 'name', dir: 'asc' },
    ])
    const flipped = cycleSort(s, 'age') // age stays first, becomes desc
    expect(flipped).toEqual([
      { key: 'age', dir: 'desc' },
      { key: 'name', dir: 'asc' },
    ])
  })

  it('sortRows breaks ties by the next entry', () => {
    const out = sortRows(ROWS, [
      { key: 'age', dir: 'asc' },
      { key: 'name', dir: 'asc' },
    ])
    // age asc: 25s first (Carol, Dave), then 30s (Alice, Bob)
    expect(out.map((r) => r.id)).toEqual([3, 4, 1, 2])
  })

  it('sortRows does not mutate the input', () => {
    const copy = [...ROWS]
    sortRows(ROWS, [{ key: 'name', dir: 'desc' }])
    expect(ROWS).toEqual(copy)
  })
})

describe('Grid component', () => {
  it('renders rows in input order with no sort', () => {
    render(<Grid rows={ROWS} />)
    expect(rowOrder()).toEqual([1, 2, 3, 4])
  })

  it('clicking a header sorts asc, then desc, then off', async () => {
    const user = userEvent.setup()
    render(<Grid rows={ROWS} />)
    await user.click(screen.getByTestId('head-name'))
    expect(rowOrder()).toEqual([1, 2, 3, 4]) // name asc Alice,Bob,Carol,Dave
    await user.click(screen.getByTestId('head-name'))
    expect(rowOrder()).toEqual([4, 3, 2, 1]) // name desc
    await user.click(screen.getByTestId('head-name'))
    expect(rowOrder()).toEqual([1, 2, 3, 4]) // off -> input order
  })

  it('supports multi-column sort with priority badges', async () => {
    const user = userEvent.setup()
    render(<Grid rows={ROWS} />)
    await user.click(screen.getByTestId('head-city')) // city asc (primary)
    await user.click(screen.getByTestId('head-age')) // age asc (secondary)
    // city asc: LA then NYC; within each, age asc
    // LA: Dave(25), Bob(30); NYC: Carol(25), Alice(30)
    expect(rowOrder()).toEqual([4, 2, 3, 1])
    expect(screen.getByTestId('badge-city')).toHaveTextContent('1')
    expect(screen.getByTestId('badge-age')).toHaveTextContent('2')
  })

  it('exposes aria-sort and removes the badge when a column turns off', async () => {
    const user = userEvent.setup()
    render(<Grid rows={ROWS} />)
    const head = screen.getByTestId('head-age')
    await user.click(head)
    expect(head.closest('th')).toHaveAttribute('aria-sort', 'ascending')
    await user.click(head)
    expect(head.closest('th')).toHaveAttribute('aria-sort', 'descending')
    await user.click(head)
    expect(head.closest('th')).toHaveAttribute('aria-sort', 'none')
    expect(screen.queryByTestId('badge-age')).toBeNull()
  })

  it('selecting individual rows toggles their checkboxes', async () => {
    const user = userEvent.setup()
    render(<Grid rows={ROWS} />)
    const cb = screen.getByTestId('select-2') as HTMLInputElement
    expect(cb.checked).toBe(false)
    await user.click(cb)
    expect(cb.checked).toBe(true)
    await user.click(cb)
    expect(cb.checked).toBe(false)
  })

  it('select-all is indeterminate when some but not all are selected', async () => {
    const user = userEvent.setup()
    render(<Grid rows={ROWS} />)
    const all = screen.getByTestId('select-all') as HTMLInputElement
    expect(all.checked).toBe(false)
    expect(all.indeterminate).toBe(false)
    await user.click(screen.getByTestId('select-1'))
    expect(all.checked).toBe(false)
    expect(all.indeterminate).toBe(true)
  })

  it('select-all selects every row, then clears all', async () => {
    const user = userEvent.setup()
    render(<Grid rows={ROWS} />)
    const all = screen.getByTestId('select-all') as HTMLInputElement
    await user.click(all)
    expect(all.checked).toBe(true)
    expect(all.indeterminate).toBe(false)
    expect((screen.getByTestId('select-3') as HTMLInputElement).checked).toBe(true)
    await user.click(all)
    expect(all.checked).toBe(false)
    expect((screen.getByTestId('select-3') as HTMLInputElement).checked).toBe(false)
  })

  it('select-all becomes fully checked once every row is hand-selected', async () => {
    const user = userEvent.setup()
    render(<Grid rows={ROWS} />)
    for (const id of [1, 2, 3, 4]) {
      await user.click(screen.getByTestId(`select-${id}`))
    }
    const all = screen.getByTestId('select-all') as HTMLInputElement
    expect(all.checked).toBe(true)
    expect(all.indeterminate).toBe(false)
  })
})
