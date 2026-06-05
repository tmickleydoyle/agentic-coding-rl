import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('steps flow', () => {
  it('lists steps in order with conversion for the all segment', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-steps'))
    const list = screen.getByTestId('step-list')
    const items = within(list).getAllByRole('listitem')
    expect(items[0]).toHaveAttribute('data-testid', 'step-st1')
    expect(items[3]).toHaveAttribute('data-testid', 'step-st4')
    expect(screen.getByTestId('step-st1-conversion')).toHaveTextContent('100')
    expect(screen.getByTestId('step-st3-conversion')).toHaveTextContent('30')
  })

  it('shows no detail before a step is selected', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-steps'))
    expect(screen.queryByTestId('step-detail')).not.toBeInTheDocument()
  })

  it('selecting a step from the funnel navigates to steps and shows its detail', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('select-st3'))
    expect(screen.getByTestId('page-steps')).toBeInTheDocument()
    expect(screen.getByTestId('step-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-name')).toHaveTextContent('Activate')
    expect(screen.getByTestId('detail-count')).toHaveTextContent('300')
  })

  it('reflects the segment in the detail count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('segment-filter'), 'desktop')
    await user.click(screen.getByTestId('select-st3'))
    // desktop activate count = 180
    expect(screen.getByTestId('detail-count')).toHaveTextContent('180')
  })
})
