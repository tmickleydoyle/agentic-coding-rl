import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('kpi detail', () => {
  it('shows no-selection when none picked', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-kpi-detail'))
    expect(screen.getByTestId('no-selection')).toBeInTheDocument()
  })

  it('opens a kpi from the dashboard and shows details', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-k1'))
    expect(screen.getByTestId('page-kpi-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-name')).toHaveTextContent('Revenue')
    expect(screen.getByTestId('detail-current')).toHaveTextContent('120')
    expect(screen.getByTestId('detail-previous')).toHaveTextContent('100')
    expect(screen.getByTestId('detail-status')).toHaveTextContent('on-track')
    expect(screen.getByTestId('detail-trend')).toHaveTextContent('up')
  })

  it('shows the percent change vs previous', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-k1'))
    // (120-100)/100 = 20%
    expect(screen.getByTestId('detail-change')).toHaveTextContent('20')
  })

  it('renders the history series', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-k1'))
    const hist = screen.getByTestId('detail-history')
    expect(within(hist).getByTestId('detail-history-0')).toHaveTextContent('90')
    expect(within(hist).getByTestId('detail-history-3')).toHaveTextContent('120')
  })
})

describe('targets page', () => {
  it('lists current targets with track status', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-targets'))
    expect(screen.getByTestId('target-k1-value')).toHaveTextContent('110')
    expect(screen.getByTestId('target-k2')).toHaveAttribute('data-ontrack', 'false')
  })

  it('editing a target flips on/off track and reflects on dashboard', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-targets'))
    // raise k1 target above current 120 => off-track
    await user.type(screen.getByTestId('target-k1-input'), '130')
    await user.click(screen.getByTestId('target-k1-save'))
    expect(screen.getByTestId('target-k1-value')).toHaveTextContent('130')
    expect(screen.getByTestId('target-k1')).toHaveAttribute('data-ontrack', 'false')
    await user.click(screen.getByTestId('nav-dashboard'))
    expect(screen.getByTestId('kpi-k1')).toHaveAttribute('data-ontrack', 'false')
    expect(screen.getByTestId('summary-ontrack')).toHaveTextContent('2')
  })
})

describe('history page', () => {
  it('shows points/max/latest per kpi', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    expect(screen.getByTestId('history-k1-points')).toHaveTextContent('4')
    expect(screen.getByTestId('history-k1-max')).toHaveTextContent('120')
    expect(screen.getByTestId('history-k1-latest')).toHaveTextContent('120')
  })

  it('opens a kpi detail from history', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    await user.click(screen.getByTestId('history-k3-open'))
    expect(screen.getByTestId('page-kpi-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-name')).toHaveTextContent('NPS')
  })

  it('toggles theme and persists it across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
    await user.click(screen.getByTestId('nav-history'))
    await user.click(screen.getByTestId('theme-toggle'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
    await user.click(screen.getByTestId('nav-dashboard'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
  })
})
