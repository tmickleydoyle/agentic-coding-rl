import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('bins list', () => {
  it('lists seeded bins with used/capacity/free', () => {
    render(<App />)
    const list = screen.getByTestId('bin-list')
    expect(within(list).getByText('A1')).toBeInTheDocument()
    expect(screen.getByTestId('bin-b1-used')).toHaveTextContent('60')
    expect(screen.getByTestId('bin-b1-capacity')).toHaveTextContent('100')
    expect(screen.getByTestId('bin-b1-free')).toHaveTextContent('40')
  })

  it('computes usage percentage per bin', () => {
    render(<App />)
    expect(screen.getByTestId('bin-b1-usage')).toHaveTextContent('60')
    expect(screen.getByTestId('bin-b2-usage')).toHaveTextContent('100')
    expect(screen.getByTestId('bin-b3-usage')).toHaveTextContent('0')
  })

  it('flags a full bin', () => {
    render(<App />)
    expect(screen.getByTestId('bin-b2')).toHaveAttribute('data-full', 'true')
    expect(screen.getByTestId('bin-b1')).toHaveAttribute('data-full', 'false')
  })

  it('opens a bin detail from the list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-b1'))
    expect(screen.getByTestId('page-bin-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-code')).toHaveTextContent('A1')
    expect(screen.getByTestId('item-Bolts-qty')).toHaveTextContent('40')
    expect(screen.getByTestId('item-Nuts-qty')).toHaveTextContent('20')
  })

  it('shows an empty message for an empty bin', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-b3'))
    expect(screen.getByTestId('bin-empty')).toBeInTheDocument()
    expect(screen.queryByTestId('item-list')).not.toBeInTheDocument()
  })
})
