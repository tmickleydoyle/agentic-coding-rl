import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('top rated', () => {
  it('ranks products by average rating descending', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-top-rated'))
    const items = screen.getAllByTestId(/^rank-p\d+$/)
    // p1 avg 4.0, p2 avg 4.0 (tie, input order keeps p1 first), p3 avg 0.0 last
    expect(items[0]).toHaveAttribute('data-testid', 'rank-p1')
    expect(items[1]).toHaveAttribute('data-testid', 'rank-p2')
    expect(items[2]).toHaveAttribute('data-testid', 'rank-p3')
    expect(screen.getByTestId('rank-p3-avg')).toHaveTextContent('0.0')
  })

  it('reorders the ranking after a low review drops a product average', async () => {
    const user = userEvent.setup()
    render(<App />)
    // drop p1 average: add a 1 to p1 => avg (5+3+1)/3 = 3.0, below p2 (4.0)
    await user.click(screen.getByTestId('nav-write-review'))
    await user.selectOptions(screen.getByTestId('product-select'), 'p1')
    await user.clear(screen.getByTestId('rating-input'))
    await user.type(screen.getByTestId('rating-input'), '1')
    await user.type(screen.getByTestId('text-input'), 'broke')
    await user.click(screen.getByTestId('submit-review'))
    await user.click(screen.getByTestId('nav-top-rated'))
    const items = screen.getAllByTestId(/^rank-p\d+$/)
    expect(items[0]).toHaveAttribute('data-testid', 'rank-p2') // 4.0 now highest
    expect(items[1]).toHaveAttribute('data-testid', 'rank-p1') // 3.0
  })
})
