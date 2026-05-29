import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import VirtualList from '../components/VirtualList'

const items = Array.from({ length: 20 }, (_, i) => `item-${i}`)

describe('VirtualList', () => {
  it('renders the top window of rows at scrollTop 0', () => {
    render(<VirtualList items={items} rowHeight={50} viewportHeight={200} />)
    // window [0,200): rows 0,1,2 fully + row 3 partial (150-200)
    expect(screen.getByTestId('row-0')).toBeInTheDocument()
    expect(screen.getByTestId('row-1')).toBeInTheDocument()
    expect(screen.getByTestId('row-2')).toBeInTheDocument()
  })

  it('includes the partially-visible last row in the window (the bug)', () => {
    render(<VirtualList items={items} rowHeight={50} viewportHeight={200} />)
    // row 3 spans 150..200 and overlaps the [0,200) window — must be rendered.
    expect(screen.getByTestId('row-3')).toBeInTheDocument()
  })

  it('does not render rows below the window at scrollTop 0', () => {
    render(<VirtualList items={items} rowHeight={50} viewportHeight={200} />)
    expect(screen.queryByTestId('row-4')).toBeNull()
  })

  it('renders the correct window after scrolling to an aligned offset', () => {
    render(<VirtualList items={items} rowHeight={50} viewportHeight={200} />)
    const vp = screen.getByTestId('viewport')
    fireEvent.scroll(vp, { target: { scrollTop: 200 } })
    // window [200,400): rows 4,5,6 full + row 7 partial (350-400)
    expect(screen.getByTestId('row-4')).toBeInTheDocument()
    expect(screen.getByTestId('row-7')).toBeInTheDocument()
    expect(screen.queryByTestId('row-3')).toBeNull()
  })

  it('renders the correct window after scrolling to an unaligned offset', () => {
    render(<VirtualList items={items} rowHeight={50} viewportHeight={200} />)
    const vp = screen.getByTestId('viewport')
    fireEvent.scroll(vp, { target: { scrollTop: 125 } })
    // window [125,325): rows 2(100-150),3,4,5,6(300-350 partial)
    expect(screen.getByTestId('row-2')).toBeInTheDocument()
    expect(screen.getByTestId('row-6')).toBeInTheDocument()
    expect(screen.queryByTestId('row-1')).toBeNull()
    expect(screen.queryByTestId('row-7')).toBeNull()
  })

  it('clamps the bottom of the list and does not render past the data', () => {
    render(<VirtualList items={items} rowHeight={50} viewportHeight={200} />)
    const vp = screen.getByTestId('viewport')
    // total height 1000; max scrollTop 800 shows rows 16..19
    fireEvent.scroll(vp, { target: { scrollTop: 800 } })
    expect(screen.getByTestId('row-16')).toBeInTheDocument()
    expect(screen.getByTestId('row-19')).toBeInTheDocument()
    expect(screen.queryByTestId('row-20')).toBeNull()
  })

  it('shows the correct text in each rendered row', () => {
    render(<VirtualList items={items} rowHeight={50} viewportHeight={120} />)
    // window [0,120): rows 0,1 full + row 2 partial (100-150)
    expect(screen.getByTestId('row-0')).toHaveTextContent('item-0')
    expect(screen.getByTestId('row-2')).toHaveTextContent('item-2')
  })

  it('renders a single overlapping row when the viewport is shorter than a row', () => {
    render(<VirtualList items={items} rowHeight={50} viewportHeight={30} />)
    // window [0,30): only row 0 overlaps
    expect(screen.getByTestId('row-0')).toBeInTheDocument()
    expect(screen.queryByTestId('row-1')).toBeNull()
  })
})
