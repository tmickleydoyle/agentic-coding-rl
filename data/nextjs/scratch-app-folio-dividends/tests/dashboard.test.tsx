import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('dividend dashboard', () => {
  it('shows totals from seed data', () => {
    render(<App />)
    // income 200+200+150+300 = 850; monthly avg round(850/12)=71; count 4; months 3
    expect(screen.getByTestId('stat-income-value')).toHaveTextContent('850')
    expect(screen.getByTestId('stat-monthly-value')).toHaveTextContent('71')
    expect(screen.getByTestId('stat-count-value')).toHaveTextContent('4')
    expect(screen.getByTestId('stat-months-value')).toHaveTextContent('3')
  })

  it('lists holdings with per-holding annual income and pay month', () => {
    render(<App />)
    const list = screen.getByTestId('holding-list')
    expect(within(list).getByText('KO')).toBeInTheDocument()
    expect(screen.getByTestId('holding-h1-income')).toHaveTextContent('200')
    expect(screen.getByTestId('holding-h3-income')).toHaveTextContent('150')
    expect(screen.getByTestId('holding-h1-month')).toHaveTextContent('Mar')
    expect(screen.getByTestId('holding-h4-month')).toHaveTextContent('Dec')
  })

  it('selecting a holding opens its detail view', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('select-h2'))
    expect(screen.getByTestId('page-holding-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-symbol')).toHaveTextContent('JNJ')
    expect(screen.getByTestId('detail-income')).toHaveTextContent('200')
  })

  it('removing a holding lowers the annual income total', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('select-h4'))
    await user.click(screen.getByTestId('remove-holding'))
    expect(screen.getByTestId('page-dashboard')).toBeInTheDocument()
    // 850 - 300 = 550; paying months drops to 2 (Dec removed)
    expect(screen.getByTestId('stat-income-value')).toHaveTextContent('550')
    expect(screen.getByTestId('stat-months-value')).toHaveTextContent('2')
  })
})
