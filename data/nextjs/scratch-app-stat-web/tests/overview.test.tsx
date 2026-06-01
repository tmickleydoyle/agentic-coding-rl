import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('overview metrics', () => {
  it('shows all-time totals by default', () => {
    render(<App />)
    // views: 1000+600+300+400 = 2300; sessions: 800+500+250+380 = 1930
    expect(screen.getByTestId('stat-total-views-value')).toHaveTextContent('2300')
    expect(screen.getByTestId('stat-total-sessions-value')).toHaveTextContent('1930')
  })

  it('computes the average bounce rate rounded to an integer', () => {
    render(<App />)
    // (40+55+70+35)/4 = 50
    expect(screen.getByTestId('stat-avg-bounce-value')).toHaveTextContent('50')
  })

  it('lists the top 3 pages by all-time views descending', () => {
    render(<App />)
    const top = screen.getByTestId('top-pages')
    // home(1000) > blog(600) > pricing(400) ; about(300) excluded
    expect(within(top).getByTestId('top-pg1')).toBeInTheDocument()
    expect(within(top).getByTestId('top-pg2')).toBeInTheDocument()
    expect(within(top).getByTestId('top-pg4')).toBeInTheDocument()
    expect(screen.queryByTestId('top-pg3')).not.toBeInTheDocument()
    expect(screen.getByTestId('top-pg1-views')).toHaveTextContent('1000')
  })

  it('recomputes totals when switching to the 7d range', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('range-filter'), '7d')
    // 7d views: 200+150+50+120 = 520
    expect(screen.getByTestId('stat-total-views-value')).toHaveTextContent('520')
    // top page views reflect 7d: home 200
    expect(screen.getByTestId('top-pg1-views')).toHaveTextContent('200')
  })

  it('recomputes totals and top order when switching to the 30d range', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('range-filter'), '30d')
    // 30d views: 600+400+120+300 = 1420
    expect(screen.getByTestId('stat-total-views-value')).toHaveTextContent('1420')
    expect(screen.getByTestId('top-pg1-views')).toHaveTextContent('600')
    // about (120) still excluded; pricing(300) included
    expect(screen.queryByTestId('top-pg3')).not.toBeInTheDocument()
  })
})
