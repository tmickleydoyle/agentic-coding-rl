import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('add activity flow', () => {
  it('blocks submitting an activity with a blank title', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add-activity'))
    await user.click(screen.getByTestId('submit-activity'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-add-activity')).toBeInTheDocument()
  })

  it('adds an activity to a trip+day and shows it on detail', async () => {
    const user = userEvent.setup()
    render(<App />)
    // select tr1 first so the add form + detail target it
    await user.click(screen.getByTestId('open-tr1'))
    await user.click(screen.getByTestId('add-activity-link'))
    await user.selectOptions(screen.getByTestId('trip-select'), 'tr1')
    await user.clear(screen.getByTestId('day-input'))
    await user.type(screen.getByTestId('day-input'), '2')
    await user.type(screen.getByTestId('title-input'), 'Ramen lunch')
    await user.clear(screen.getByTestId('cost-input'))
    await user.type(screen.getByTestId('cost-input'), '15')
    await user.click(screen.getByTestId('submit-activity'))
    expect(screen.getByTestId('page-trip-detail')).toBeInTheDocument()
    const day2 = screen.getByTestId('day-2-list')
    expect(within(day2).getByText('Ramen lunch')).toBeInTheDocument()
    // day-2 cost now 120 + 15
    expect(screen.getByTestId('day-2-cost')).toHaveTextContent('135')
  })

  it('updates the grand total on the budget page after adding', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-tr2'))
    await user.click(screen.getByTestId('add-activity-link'))
    await user.selectOptions(screen.getByTestId('trip-select'), 'tr2')
    await user.type(screen.getByTestId('title-input'), 'Gelato')
    await user.clear(screen.getByTestId('cost-input'))
    await user.type(screen.getByTestId('cost-input'), '8')
    await user.click(screen.getByTestId('submit-activity'))
    await user.click(screen.getByTestId('nav-budget'))
    // seed grand total 0+60+120+25 = 205, + 8 = 213
    expect(screen.getByTestId('stat-grand-total-value')).toHaveTextContent('213')
    expect(screen.getByTestId('budget-tr2-cost')).toHaveTextContent('33')
  })
})
