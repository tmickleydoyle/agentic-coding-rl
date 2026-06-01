import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('add standup flow', () => {
  it('blocks submitting without yesterday/today', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add-entry'))
    await user.click(screen.getByTestId('submit-entry'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-add-entry')).toBeInTheDocument()
  })

  it('blocks when only yesterday is filled', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add-entry'))
    await user.type(screen.getByTestId('yesterday-input'), 'Did stuff')
    await user.click(screen.getByTestId('submit-entry'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
  })

  it('adds an entry and shows it on today', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add-entry'))
    await user.selectOptions(screen.getByTestId('member-select'), 'm2')
    await user.type(screen.getByTestId('yesterday-input'), 'Shipped feature')
    await user.type(screen.getByTestId('today-input'), 'Plan sprint')
    await user.click(screen.getByTestId('submit-entry'))
    expect(screen.getByTestId('page-today')).toBeInTheDocument()
    const list = screen.getByTestId('today-list')
    expect(within(list).getByText('Plan sprint')).toBeInTheDocument()
    expect(within(list).getByText('Grace')).toBeInTheDocument()
  })

  it('a new entry with a blocker increments today blocker count', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('today-blocker-count')).toHaveTextContent('0')
    await user.click(screen.getByTestId('nav-add-entry'))
    await user.type(screen.getByTestId('yesterday-input'), 'A')
    await user.type(screen.getByTestId('today-input'), 'B')
    await user.type(screen.getByTestId('blocker-input'), 'Blocked on infra')
    await user.click(screen.getByTestId('submit-entry'))
    expect(screen.getByTestId('today-blocker-count')).toHaveTextContent('1')
  })

  it('a new entry increments the member team count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add-entry'))
    await user.selectOptions(screen.getByTestId('member-select'), 'm3')
    await user.type(screen.getByTestId('yesterday-input'), 'A')
    await user.type(screen.getByTestId('today-input'), 'B')
    await user.click(screen.getByTestId('submit-entry'))
    await user.click(screen.getByTestId('nav-team'))
    expect(screen.getByTestId('team-member-m3-count')).toHaveTextContent('1')
  })

  it('a new entry without a blocker is not marked as blocked', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add-entry'))
    await user.type(screen.getByTestId('yesterday-input'), 'A')
    await user.type(screen.getByTestId('today-input'), 'B')
    await user.click(screen.getByTestId('submit-entry'))
    const list = screen.getByTestId('today-list')
    const cards = within(list).getAllByText('B')
    expect(cards.length).toBeGreaterThan(0)
    expect(screen.getByTestId('today-blocker-count')).toHaveTextContent('0')
  })
})
