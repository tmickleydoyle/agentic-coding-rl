import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function openDetail(user: ReturnType<typeof userEvent.setup>, id: string) {
  await user.click(screen.getByTestId(`select-${id}`))
}

describe('holding detail', () => {
  it('shows value, cost, gain/loss and allocation for a winner', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openDetail(user, 'h1')
    expect(screen.getByTestId('detail-value')).toHaveTextContent('2000')
    expect(screen.getByTestId('detail-cost')).toHaveTextContent('1500')
    expect(screen.getByTestId('detail-gainloss')).toHaveTextContent('500')
    expect(screen.getByTestId('detail-gainloss-percent')).toHaveTextContent('33')
    expect(screen.getByTestId('detail-allocation')).toHaveTextContent('36')
    expect(screen.getByTestId('detail-gain-marker')).toBeInTheDocument()
  })

  it('marks a losing holding at a loss', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openDetail(user, 'h3')
    expect(screen.getByTestId('detail-gainloss')).toHaveTextContent('-400')
    expect(screen.getByTestId('detail-gainloss-percent')).toHaveTextContent('-20')
    expect(screen.getByTestId('detail-loss-marker')).toBeInTheDocument()
  })

  it('shows per-share cost basis and current price', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openDetail(user, 'h2')
    expect(screen.getByTestId('detail-cost-basis')).toHaveTextContent('300')
    expect(screen.getByTestId('detail-price')).toHaveTextContent('400')
    expect(screen.getByTestId('detail-shares')).toHaveTextContent('5')
  })

  it('removes the holding and returns to the portfolio', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openDetail(user, 'h1')
    await user.click(screen.getByTestId('remove-holding'))
    expect(screen.getByTestId('page-portfolio')).toBeInTheDocument()
    expect(screen.queryByTestId('holding-h1')).not.toBeInTheDocument()
    // total value drops by 2000 => 3600
    expect(screen.getByTestId('stat-value-value')).toHaveTextContent('3600')
  })
})
