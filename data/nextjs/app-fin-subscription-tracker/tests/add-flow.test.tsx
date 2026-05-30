import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('add subscription flow', () => {
  it('blocks submitting with a blank name', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('cost-input'), '5')
    await user.type(screen.getByTestId('renewal-input'), '2026-07-01')
    await user.click(screen.getByTestId('submit-sub'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-add')).toBeInTheDocument()
  })

  it('blocks submitting with a non-positive cost', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('name-input'), 'Bad')
    await user.type(screen.getByTestId('cost-input'), '0')
    await user.type(screen.getByTestId('renewal-input'), '2026-07-01')
    await user.click(screen.getByTestId('submit-sub'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
  })

  it('blocks submitting without a renewal date', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('name-input'), 'NoDate')
    await user.type(screen.getByTestId('cost-input'), '5')
    await user.click(screen.getByTestId('submit-sub'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
  })

  it('adds an annual subscription and navigates to the list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('name-input'), 'Adobe')
    await user.type(screen.getByTestId('cost-input'), '240')
    await user.selectOptions(screen.getByTestId('cycle-select'), 'annual')
    await user.type(screen.getByTestId('renewal-input'), '2026-08-01')
    await user.click(screen.getByTestId('submit-sub'))
    expect(screen.getByTestId('page-subscriptions')).toBeInTheDocument()
    expect(within(screen.getByTestId('sub-list')).getByText('Adobe')).toBeInTheDocument()
    // annual 240 => monthly 20
    expect(screen.getByTestId('sub-s5-monthly')).toHaveTextContent('20')
  })
})
