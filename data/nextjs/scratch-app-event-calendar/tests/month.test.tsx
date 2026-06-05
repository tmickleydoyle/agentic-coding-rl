import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('month grid', () => {
  it('renders all 31 day cells', () => {
    render(<App />)
    expect(screen.getByTestId('day-1')).toBeInTheDocument()
    expect(screen.getByTestId('day-31')).toBeInTheDocument()
    expect(screen.queryByTestId('day-32')).not.toBeInTheDocument()
  })

  it('renders leading blank cells for the first weekday offset', () => {
    render(<App />)
    // FIRST_WEEKDAY = 3 -> blanks at indices 0,1,2
    expect(screen.getByTestId('cell-blank-0')).toBeInTheDocument()
    expect(screen.getByTestId('cell-blank-2')).toBeInTheDocument()
    expect(screen.queryByTestId('cell-blank-3')).not.toBeInTheDocument()
  })

  it('shows the event count on a day', () => {
    render(<App />)
    expect(screen.getByTestId('day-2-count')).toHaveTextContent('2')
    expect(screen.getByTestId('day-15-count')).toHaveTextContent('1')
    expect(screen.getByTestId('day-3-count')).toHaveTextContent('0')
  })

  it('respects the category filter in day counts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('category-filter'), 'work')
    // day 2 has 1 work (Standup) and 1 social (Lunch) -> filtered to 1
    expect(screen.getByTestId('day-2-count')).toHaveTextContent('1')
  })

  it('clicking a day opens its detail page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('day-2'))
    expect(screen.getByTestId('page-event-detail')).toBeInTheDocument()
    expect(screen.getByTestId('day-heading')).toHaveTextContent('2')
    const list = screen.getByTestId('day-events')
    expect(within(list).getByText('Standup')).toBeInTheDocument()
    expect(within(list).getByText('Lunch')).toBeInTheDocument()
  })
})
