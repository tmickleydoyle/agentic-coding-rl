import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('regions view', () => {
  it('shows revenue summed per region in fixed order', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-regions'))
    // NA 1800/14, EU 800/8, APAC 1900/13
    expect(screen.getByTestId('region-NA-revenue')).toHaveTextContent('1800')
    expect(screen.getByTestId('region-NA-units')).toHaveTextContent('14')
    expect(screen.getByTestId('region-EU-revenue')).toHaveTextContent('800')
    expect(screen.getByTestId('region-APAC-revenue')).toHaveTextContent('1900')
  })

  it('always shows all three regions even when filtered', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('region-filter'), 'NA')
    await user.click(screen.getByTestId('nav-regions'))
    expect(screen.getByTestId('region-NA-revenue')).toHaveTextContent('1800')
    // filtered to NA so EU/APAC are zero but still present
    expect(screen.getByTestId('region-EU-revenue')).toHaveTextContent('0')
    expect(screen.getByTestId('region-APAC-revenue')).toHaveTextContent('0')
  })
})

describe('trends view', () => {
  it('shows revenue per month', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-trends'))
    // Jan 1800, Feb 800, Mar 1900
    expect(screen.getByTestId('month-Jan-revenue')).toHaveTextContent('1800')
    expect(screen.getByTestId('month-Feb-revenue')).toHaveTextContent('800')
    expect(screen.getByTestId('month-Mar-revenue')).toHaveTextContent('1900')
  })

  it('computes the trend direction up when Mar exceeds Jan', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-trends'))
    expect(screen.getByTestId('trend-direction')).toHaveTextContent('up')
  })

  it('computes the trend direction down within the NA filter', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('region-filter'), 'NA')
    await user.click(screen.getByTestId('nav-trends'))
    // NA: Jan 1800, Mar 0 => down
    expect(screen.getByTestId('month-Jan-revenue')).toHaveTextContent('1800')
    expect(screen.getByTestId('trend-direction')).toHaveTextContent('down')
  })
})

describe('theme', () => {
  it('reflects theme on app root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})
