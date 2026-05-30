import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function openDetail(user: ReturnType<typeof userEvent.setup>, id: string) {
  await user.click(screen.getByTestId(`select-${id}`))
}

describe('coin detail', () => {
  it('shows value, change and allocation for a coin that is up', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openDetail(user, 'c1')
    expect(screen.getByTestId('detail-value')).toHaveTextContent('30000')
    expect(screen.getByTestId('detail-change')).toHaveTextContent('5')
    expect(screen.getByTestId('detail-change-amount')).toHaveTextContent('1500')
    expect(screen.getByTestId('detail-allocation')).toHaveTextContent('64')
    expect(screen.getByTestId('detail-up-marker')).toBeInTheDocument()
  })

  it('marks a coin that is down over 24h', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openDetail(user, 'c2')
    expect(screen.getByTestId('detail-change-amount')).toHaveTextContent('-240')
    expect(screen.getByTestId('detail-down-marker')).toBeInTheDocument()
  })

  it('shows amount and price per unit', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openDetail(user, 'c3')
    expect(screen.getByTestId('detail-amount')).toHaveTextContent('50')
    expect(screen.getByTestId('detail-price')).toHaveTextContent('100')
    expect(screen.getByTestId('detail-name')).toHaveTextContent('Solana')
  })

  it('removes the coin and returns to the portfolio', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openDetail(user, 'c1')
    await user.click(screen.getByTestId('remove-coin'))
    expect(screen.getByTestId('page-portfolio')).toBeInTheDocument()
    expect(screen.queryByTestId('coin-c1')).not.toBeInTheDocument()
    // total value drops by 30000 => 17000
    expect(screen.getByTestId('stat-value-value')).toHaveTextContent('17000')
  })
})
