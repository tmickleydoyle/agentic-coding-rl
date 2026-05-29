import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ReorderList from '../components/ReorderList'

const base = ['A', 'B', 'C', 'D', 'E']

function order() {
  return base.map((_, i) => {
    const el = screen.queryByTestId(`item-${i}`)
    return el ? el.textContent : null
  }).filter((x): x is string => x !== null)
}

describe('ReorderList', () => {
  it('renders items in initial order', () => {
    render(<ReorderList initialItems={base} />)
    expect(order()).toEqual(['A', 'B', 'C', 'D', 'E'])
  })

  it('moves an item up by one position', () => {
    render(<ReorderList initialItems={base} />)
    fireEvent.click(screen.getByTestId('up-2')) // move C up
    expect(order()).toEqual(['A', 'C', 'B', 'D', 'E'])
  })

  it('moves an item down by one position (the bug)', () => {
    render(<ReorderList initialItems={base} />)
    fireEvent.click(screen.getByTestId('down-1')) // move B down past C
    expect(order()).toEqual(['A', 'C', 'B', 'D', 'E'])
  })

  it('moving the first item down lands it at index 1', () => {
    render(<ReorderList initialItems={base} />)
    fireEvent.click(screen.getByTestId('down-0'))
    expect(order()).toEqual(['B', 'A', 'C', 'D', 'E'])
  })

  it('moving the last item up lands it at second-to-last', () => {
    render(<ReorderList initialItems={base} />)
    fireEvent.click(screen.getByTestId('up-4'))
    expect(order()).toEqual(['A', 'B', 'C', 'E', 'D'])
  })

  it('repeated down moves walk an item to the bottom', () => {
    render(<ReorderList initialItems={base} />)
    fireEvent.click(screen.getByTestId('down-0')) // A -> idx1
    fireEvent.click(screen.getByTestId('down-1')) // A -> idx2
    fireEvent.click(screen.getByTestId('down-2')) // A -> idx3
    fireEvent.click(screen.getByTestId('down-3')) // A -> idx4
    expect(order()).toEqual(['B', 'C', 'D', 'E', 'A'])
  })

  it('up at the top and down at the bottom are disabled (no movement)', () => {
    render(<ReorderList initialItems={base} />)
    expect(screen.getByTestId('up-0')).toBeDisabled()
    expect(screen.getByTestId('down-4')).toBeDisabled()
  })

  it('down then up returns to the original order', () => {
    render(<ReorderList initialItems={base} />)
    fireEvent.click(screen.getByTestId('down-2')) // -> A B D C E
    expect(order()).toEqual(['A', 'B', 'D', 'C', 'E'])
    fireEvent.click(screen.getByTestId('up-3')) // move C back up
    expect(order()).toEqual(['A', 'B', 'C', 'D', 'E'])
  })
})
