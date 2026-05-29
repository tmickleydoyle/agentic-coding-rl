import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import VirtualList from '../components/VirtualList'

// 100 items, rowHeight 20, viewport 100 => visibleCount = 5, overscan 2 each side.
const ITEMS = Array.from({ length: 100 }, (_, i) => `Item ${i}`)

function renderedIndexes(): number[] {
  return screen
    .getAllByTestId(/^row-/)
    .map((el) => Number(el.getAttribute('data-testid')!.slice('row-'.length)))
    .sort((a, b) => a - b)
}

function scroll(top: number) {
  fireEvent.scroll(screen.getByTestId('viewport'), { target: { scrollTop: top } })
}

describe('Virtual scroll list', () => {
  it('renders only the top window plus overscan at scrollTop 0', () => {
    render(<VirtualList items={ITEMS} rowHeight={20} viewportHeight={100} />)
    // first=0, visibleCount=5, start=0, end=min(99, 0+5-1+2)=6
    expect(renderedIndexes()).toEqual([0, 1, 2, 3, 4, 5, 6])
  })

  it('does NOT render far-away rows', () => {
    render(<VirtualList items={ITEMS} rowHeight={20} viewportHeight={100} />)
    expect(screen.queryByTestId('row-50')).toBeNull()
    expect(screen.queryByTestId('row-99')).toBeNull()
  })

  it('the spacer has the full scroll height', () => {
    render(<VirtualList items={ITEMS} rowHeight={20} viewportHeight={100} />)
    expect(screen.getByTestId('spacer').style.height).toBe('2000px')
  })

  it('positions each row absolutely at index * rowHeight', () => {
    render(<VirtualList items={ITEMS} rowHeight={20} viewportHeight={100} />)
    const row3 = screen.getByTestId('row-3')
    expect(row3.style.position).toBe('absolute')
    expect(row3.style.top).toBe('60px')
    expect(row3.style.height).toBe('20px')
  })

  it('renders the correct text for a row', () => {
    render(<VirtualList items={ITEMS} rowHeight={20} viewportHeight={100} />)
    expect(screen.getByTestId('row-4')).toHaveTextContent('Item 4')
  })

  it('scrolling reveals a middle window and hides the top', () => {
    render(<VirtualList items={ITEMS} rowHeight={20} viewportHeight={100} />)
    scroll(400) // first = floor(400/20)=20, start=18, end=min(99,20+5-1+2)=26
    expect(renderedIndexes()).toEqual([18, 19, 20, 21, 22, 23, 24, 25, 26])
    expect(screen.queryByTestId('row-0')).toBeNull()
  })

  it('clamps the window at the bottom (no out-of-range rows)', () => {
    render(<VirtualList items={ITEMS} rowHeight={20} viewportHeight={100} />)
    scroll(2000) // first = floor(2000/20)=100, start=98, end=min(99, ...)=99
    expect(renderedIndexes()).toEqual([98, 99])
    expect(screen.queryByTestId('row-100')).toBeNull()
  })

  it('overscan keeps rows just above the window mounted', () => {
    render(<VirtualList items={ITEMS} rowHeight={20} viewportHeight={100} />)
    scroll(200) // first=10, start=8, end=min(99,10+5-1+2)=16
    expect(renderedIndexes()).toEqual([8, 9, 10, 11, 12, 13, 14, 15, 16])
  })

  it('handles a partial last window when items are few', () => {
    const few = Array.from({ length: 3 }, (_, i) => `Item ${i}`)
    render(<VirtualList items={few} rowHeight={20} viewportHeight={100} />)
    expect(renderedIndexes()).toEqual([0, 1, 2])
    expect(screen.getByTestId('spacer').style.height).toBe('60px')
  })

  it('renders nothing and a zero-height spacer for an empty list', () => {
    render(<VirtualList items={[]} rowHeight={20} viewportHeight={100} />)
    expect(screen.queryAllByTestId(/^row-/)).toHaveLength(0)
    expect(screen.getByTestId('spacer').style.height).toBe('0px')
  })

  it('reacts to a smaller viewport by windowing fewer rows', () => {
    render(<VirtualList items={ITEMS} rowHeight={20} viewportHeight={40} />)
    // visibleCount = ceil(40/20)=2, start=0, end=min(99,0+2-1+2)=3
    expect(renderedIndexes()).toEqual([0, 1, 2, 3])
  })
})
