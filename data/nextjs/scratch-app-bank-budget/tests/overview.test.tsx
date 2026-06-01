import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../app/page'

describe('overview', () => {
  it('shows totals derived from transactions and limits', () => {
    render(<App />)
    // limits: 300 + 500 + 200 = 1000
    expect(screen.getByTestId('stat-limit-value')).toHaveTextContent('1000')
    // spent: c1 180, c2 540, c3 150 => 870
    expect(screen.getByTestId('stat-spent-value')).toHaveTextContent('870')
    // remaining: 1000 - 870 = 130
    expect(screen.getByTestId('stat-remaining-value')).toHaveTextContent('130')
    // one category (Shopping) is over limit
    expect(screen.getByTestId('stat-overlimit-value')).toHaveTextContent('1')
  })

  it('shows the over-limit alert when a category exceeds its limit', () => {
    render(<App />)
    expect(screen.getByTestId('overall-alert')).toBeInTheDocument()
    expect(screen.queryByTestId('overall-ok')).not.toBeInTheDocument()
  })

  it('shows the current currency', () => {
    render(<App />)
    expect(screen.getByTestId('currency-label')).toHaveTextContent('USD')
  })
})
