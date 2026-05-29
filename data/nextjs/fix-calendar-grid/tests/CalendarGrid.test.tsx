import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CalendarGrid from '../components/CalendarGrid'

describe('CalendarGrid', () => {
  it('places Jan 1 2024 (a Monday) in week 0, column 1', () => {
    render(<CalendarGrid year={2024} month={1} />)
    expect(screen.getByTestId('cell-0-1')).toHaveTextContent('1')
    // Sunday column of week 0 is blank (no testid)
    expect(screen.queryByTestId('cell-0-0')).toBeNull()
  })

  it('places Jan 31 2024 in week 4, column 3', () => {
    render(<CalendarGrid year={2024} month={1} />)
    expect(screen.getByTestId('cell-4-3')).toHaveTextContent('31')
  })

  it('places Feb 1 2024 in week 0, column 4 (Thursday)', () => {
    render(<CalendarGrid year={2024} month={2} />)
    expect(screen.getByTestId('cell-0-4')).toHaveTextContent('1')
  })

  it('renders Feb 29 in a leap year and puts it in week 4, column 4 (the bug)', () => {
    render(<CalendarGrid year={2024} month={2} />)
    expect(screen.getByTestId('cell-4-4')).toHaveTextContent('29')
  })

  it('non-leap Feb 2023 has 28 days ending in week 3 column 2 and no 29th', () => {
    render(<CalendarGrid year={2023} month={2} />)
    // Feb 1 2023 is a Wednesday (col 3); Feb 28 is at index 3+27=30 -> week4 col2
    expect(screen.getByTestId('cell-0-3')).toHaveTextContent('1')
    expect(screen.getByTestId('cell-4-2')).toHaveTextContent('28')
  })

  it('handles a month whose 1st is a Saturday (May 2021, col 6)', () => {
    render(<CalendarGrid year={2021} month={5} />)
    expect(screen.getByTestId('cell-0-6')).toHaveTextContent('1')
    // May 2 spills to week 1, column 0
    expect(screen.getByTestId('cell-1-0')).toHaveTextContent('2')
  })

  it('handles a month whose 1st is a Sunday (Sep 2024, col 0)', () => {
    render(<CalendarGrid year={2024} month={9} />)
    expect(screen.getByTestId('cell-0-0')).toHaveTextContent('1')
    expect(screen.getByTestId('cell-4-1')).toHaveTextContent('30')
  })

  it('places May 15 2021 in week 2, column 6', () => {
    render(<CalendarGrid year={2021} month={5} />)
    expect(screen.getByTestId('cell-2-6')).toHaveTextContent('15')
  })
})
