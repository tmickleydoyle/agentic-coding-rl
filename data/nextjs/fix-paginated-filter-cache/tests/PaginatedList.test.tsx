import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PaginatedList from '../components/PaginatedList'

const items = [
  'apple',
  'apricot',
  'avocado',
  'banana',
  'blueberry',
  'cherry',
  'cranberry',
  'date',
  'fig',
  'grape',
]

function rows(): string[] {
  const out: string[] = []
  for (let i = 0; i < 3; i++) {
    const el = screen.queryByTestId(`row-${i}`)
    if (!el) break
    out.push(el.textContent || '')
  }
  return out
}

function setFilter(v: string) {
  fireEvent.change(screen.getByTestId('filter'), { target: { value: v } })
}

describe('PaginatedList', () => {
  it('shows the first page of unfiltered items', () => {
    render(<PaginatedList items={items} />)
    expect(rows()).toEqual(['apple', 'apricot', 'avocado'])
    expect(screen.getByTestId('page')).toHaveTextContent('1')
  })

  it('paginates forward through unfiltered items', () => {
    render(<PaginatedList items={items} />)
    fireEvent.click(screen.getByTestId('next'))
    expect(screen.getByTestId('page')).toHaveTextContent('2')
    expect(rows()).toEqual(['banana', 'blueberry', 'cherry'])
  })

  it('paginates backward', () => {
    render(<PaginatedList items={items} />)
    fireEvent.click(screen.getByTestId('next'))
    fireEvent.click(screen.getByTestId('prev'))
    expect(screen.getByTestId('page')).toHaveTextContent('1')
    expect(rows()).toEqual(['apple', 'apricot', 'avocado'])
  })

  it('filtering shows only matching rows, not stale cached rows (the bug)', () => {
    render(<PaginatedList items={items} />)
    // page 1 is now cached as [apple, apricot, avocado]
    setFilter('berry')
    expect(rows()).toEqual(['blueberry', 'cranberry'])
  })

  it('changing the filter resets to page 1', () => {
    render(<PaginatedList items={items} />)
    fireEvent.click(screen.getByTestId('next')) // page 2
    setFilter('a')
    expect(screen.getByTestId('page')).toHaveTextContent('1')
    expect(rows()).toEqual(['apple', 'apricot', 'avocado'])
  })

  it('serves a correctly cached page on revisit under the same filter', () => {
    render(<PaginatedList items={items} />)
    setFilter('a') // 7 matches -> 3 pages
    fireEvent.click(screen.getByTestId('next')) // page 2
    fireEvent.click(screen.getByTestId('prev')) // back to page 1
    expect(rows()).toEqual(['apple', 'apricot', 'avocado'])
  })

  it('does not leak rows across filters when revisiting the same page number', () => {
    render(<PaginatedList items={items} />)
    fireEvent.click(screen.getByTestId('next')) // cache page 2 under no filter
    setFilter('berry') // 2 matches, single page
    expect(rows()).toEqual(['blueberry', 'cranberry'])
    setFilter('') // back to no filter
    expect(rows()).toEqual(['apple', 'apricot', 'avocado'])
  })

  it('clearing the filter restores the full first page', () => {
    render(<PaginatedList items={items} />)
    setFilter('cherry')
    expect(rows()).toEqual(['cherry'])
    setFilter('')
    expect(rows()).toEqual(['apple', 'apricot', 'avocado'])
    expect(screen.getByTestId('page')).toHaveTextContent('1')
  })
})
