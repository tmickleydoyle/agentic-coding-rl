import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

function poll(question: string): HTMLElement {
  return screen.getByRole('region', { name: question })
}
async function addOption(u: U, text: string) {
  await u.clear(screen.getByLabelText(/^option$/i))
  await u.type(screen.getByLabelText(/^option$/i), text)
  await u.click(screen.getByRole('button', { name: /add option/i }))
}

describe('Poll app', () => {
  it('shows the seeded poll with counts and percentages', () => {
    render(<App />)
    const p = poll('Best language?')
    expect(within(p).getByText(/python: 3 \(75%\)/i)).toBeInTheDocument()
    expect(within(p).getByText(/javascript: 1 \(25%\)/i)).toBeInTheDocument()
    expect(within(p).getByText(/rust: 0 \(0%\)/i)).toBeInTheDocument()
    expect(within(p).getByText(/total votes: 4/i)).toBeInTheDocument()
  })

  it('exposes each share as a progress bar value', () => {
    render(<App />)
    const p = poll('Best language?')
    expect(within(p).getByRole('progressbar', { name: 'Python share' })).toHaveAttribute(
      'aria-valuenow',
      '75',
    )
    expect(within(p).getByRole('progressbar', { name: 'JavaScript share' })).toHaveAttribute(
      'aria-valuenow',
      '25',
    )
  })

  it('records a vote and recomputes counts, percentages, and total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(poll('Best language?')).getByRole('button', { name: /vote for rust/i }))
    const p = poll('Best language?')
    expect(within(p).getByText(/rust: 1 \(20%\)/i)).toBeInTheDocument()
    expect(within(p).getByText(/python: 3 \(60%\)/i)).toBeInTheDocument()
    expect(within(p).getByText(/total votes: 5/i)).toBeInTheDocument()
  })

  it('disables all vote buttons after voting once', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(poll('Best language?')).getByRole('button', { name: /vote for python/i }))
    const p = poll('Best language?')
    expect(within(p).getByRole('button', { name: /vote for python/i })).toBeDisabled()
    expect(within(p).getByRole('button', { name: /vote for rust/i })).toBeDisabled()
    expect(within(p).getByText(/total votes: 5/i)).toBeInTheDocument()
  })

  it('disables Create poll until there is a question and two options', async () => {
    const u = userEvent.setup()
    render(<App />)
    const create = () => screen.getByRole('button', { name: /create poll/i })
    expect(create()).toBeDisabled()
    await u.type(screen.getByLabelText(/question/i), 'Best fruit?')
    await addOption(u, 'Apple')
    expect(create()).toBeDisabled()
    await addOption(u, 'Banana')
    expect(create()).toBeEnabled()
  })

  it('creates a new poll with dynamic options at zero votes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/question/i), 'Best fruit?')
    await addOption(u, 'Apple')
    await addOption(u, 'Banana')
    await u.click(screen.getByRole('button', { name: /create poll/i }))
    const p = poll('Best fruit?')
    expect(within(p).getByText(/apple: 0 \(0%\)/i)).toBeInTheDocument()
    expect(within(p).getByText(/banana: 0 \(0%\)/i)).toBeInTheDocument()
    expect(within(p).getByText(/total votes: 0/i)).toBeInTheDocument()
  })

  it('resets the build form after creating a poll', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/question/i), 'Best fruit?')
    await addOption(u, 'Apple')
    await addOption(u, 'Banana')
    await u.click(screen.getByRole('button', { name: /create poll/i }))
    expect(screen.getByLabelText(/question/i)).toHaveValue('')
    expect(screen.getByRole('button', { name: /create poll/i })).toBeDisabled()
  })

  it('votes independently across polls', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/question/i), 'Best fruit?')
    await addOption(u, 'Apple')
    await addOption(u, 'Banana')
    await u.click(screen.getByRole('button', { name: /create poll/i }))
    await u.click(within(poll('Best fruit?')).getByRole('button', { name: /vote for apple/i }))
    expect(within(poll('Best fruit?')).getByText(/apple: 1 \(100%\)/i)).toBeInTheDocument()
    // seeded poll is untouched
    expect(within(poll('Best language?')).getByText(/total votes: 4/i)).toBeInTheDocument()
  })
})
