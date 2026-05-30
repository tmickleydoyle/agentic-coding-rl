import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('overview totals', () => {
  it('shows all-region totals by default', () => {
    render(<App />)
    expect(screen.getByTestId('stat-revenue-value')).toHaveTextContent('4500')
    expect(screen.getByTestId('stat-units-value')).toHaveTextContent('35')
    expect(screen.getByTestId('stat-orders-value')).toHaveTextContent('6')
  })

  it('shows the top product by revenue', () => {
    render(<App />)
    expect(screen.getByTestId('stat-top-product-value')).toHaveTextContent('Widget')
  })

  it('recomputes totals when filtering by region NA', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('region-filter'), 'NA')
    // NA: o1 Widget 1000/u10, o3 Gadget 800/u4 => rev 1800, units 14, orders 2
    expect(screen.getByTestId('stat-revenue-value')).toHaveTextContent('1800')
    expect(screen.getByTestId('stat-units-value')).toHaveTextContent('14')
    expect(screen.getByTestId('stat-orders-value')).toHaveTextContent('2')
    expect(screen.getByTestId('stat-top-product-value')).toHaveTextContent('Widget')
  })

  it('recomputes totals when filtering by region EU', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('region-filter'), 'EU')
    // EU: o2 Widget 500/u5, o5 Gizmo 300/u3 => rev 800, units 8, orders 2
    expect(screen.getByTestId('stat-revenue-value')).toHaveTextContent('800')
    expect(screen.getByTestId('stat-units-value')).toHaveTextContent('8')
    expect(screen.getByTestId('stat-top-product-value')).toHaveTextContent('Widget')
  })
})
