import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function openDetail(user: ReturnType<typeof userEvent.setup>, id: string) {
  await user.click(screen.getByTestId(`select-${id}`))
}

describe('goal detail', () => {
  it('shows progress, remaining, and projected completion', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openDetail(user, 'g1')
    expect(screen.getByTestId('detail-percent')).toHaveTextContent('40')
    expect(screen.getByTestId('detail-remaining')).toHaveTextContent('6000')
    // remaining 6000 / monthly 1000 = 6 months from 2026-05 => 2026-11
    expect(screen.getByTestId('detail-completion')).toHaveTextContent('2026-11')
  })

  it('marks a completed goal as reached', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openDetail(user, 'g2')
    expect(screen.getByTestId('detail-complete')).toBeInTheDocument()
    expect(screen.getByTestId('detail-completion')).toHaveTextContent('Complete')
  })

  it('lists the contributions for the selected goal', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openDetail(user, 'g1')
    const list = screen.getByTestId('contribution-list')
    expect(within(list).getByTestId('contribution-c1-amount')).toHaveTextContent('1000')
    expect(within(list).getByTestId('contribution-c2-amount')).toHaveTextContent('3000')
    expect(within(list).queryByTestId('contribution-c3-amount')).not.toBeInTheDocument()
  })

  it('blocks a non-positive contribution', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openDetail(user, 'g3')
    await user.type(screen.getByTestId('amount-input'), '0')
    await user.click(screen.getByTestId('submit-contribution'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
  })

  it('adds a contribution which raises saved and progress', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openDetail(user, 'g3') // saved 500, target 2000
    await user.type(screen.getByTestId('amount-input'), '500')
    await user.click(screen.getByTestId('submit-contribution'))
    expect(screen.getByTestId('detail-saved')).toHaveTextContent('1000')
    expect(screen.getByTestId('detail-percent')).toHaveTextContent('50')
    expect(screen.getByTestId('contribution-c4-amount')).toHaveTextContent('500')
  })

  it('reaches the goal when contributions fill the gap', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openDetail(user, 'g3') // remaining 1500
    await user.type(screen.getByTestId('amount-input'), '1500')
    await user.click(screen.getByTestId('submit-contribution'))
    expect(screen.getByTestId('detail-complete')).toBeInTheDocument()
    expect(screen.getByTestId('detail-percent')).toHaveTextContent('100')
  })
})
