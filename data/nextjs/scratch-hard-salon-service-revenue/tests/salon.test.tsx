import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function sale(u: U, client: string, service: string, tip: string) {
  await u.clear(screen.getByLabelText(/client/i))
  if (client) await u.type(screen.getByLabelText(/client/i), client)
  await u.selectOptions(screen.getByLabelText(/service/i), service)
  await u.clear(screen.getByLabelText(/tip/i))
  if (tip) await u.type(screen.getByLabelText(/tip/i), tip)
  await u.click(screen.getByRole('button', { name: /record sale/i }))
}
const servicesView = () => screen.getByRole('region', { name: 'Services view' })

describe('Salon sales app', () => {
  it('starts on Sales', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Sales' })).toBeInTheDocument()
  })

  it('navigates to every view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Services')
    expect(screen.getByRole('heading', { name: 'Services' })).toBeInTheDocument()
    await nav(u, 'Reports')
    expect(screen.getByRole('heading', { name: 'Reports' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Sales')
    expect(screen.getByRole('heading', { name: 'Sales' })).toBeInTheDocument()
  })

  it('records a sale with price and tip', async () => {
    const u = userEvent.setup()
    render(<App />)
    await sale(u, 'Dana', 'Color', '10')
    expect(screen.getByText('Dana: Color $90 + $10 tip')).toBeInTheDocument()
  })

  it('treats a blank tip as $0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await sale(u, 'Cara', 'Haircut', '')
    expect(screen.getByText('Cara: Haircut $40 + $0 tip')).toBeInTheDocument()
  })

  it('treats a negative tip as $0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await sale(u, 'Bo', 'Manicure', '-5')
    expect(screen.getByText('Bo: Manicure $25 + $0 tip')).toBeInTheDocument()
  })

  it('ignores a blank client name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await sale(u, '', 'Color', '10')
    await nav(u, 'Reports')
    expect(screen.getByText(/total sales: 0/i)).toBeInTheDocument()
  })

  it('counts sales per service (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await sale(u, 'A', 'Color', '0')
    await sale(u, 'B', 'Color', '0')
    await sale(u, 'C', 'Haircut', '0')
    await nav(u, 'Services')
    expect(within(servicesView()).getByText(/color: 2 sold, \$180 revenue/i)).toBeInTheDocument()
    expect(within(servicesView()).getByText(/haircut: 1 sold, \$40 revenue/i)).toBeInTheDocument()
    expect(within(servicesView()).getByText(/manicure: 0 sold, \$0 revenue/i)).toBeInTheDocument()
  })

  it('includes tips in per-service revenue', async () => {
    const u = userEvent.setup()
    render(<App />)
    await sale(u, 'A', 'Haircut', '10')
    await sale(u, 'B', 'Haircut', '5')
    await nav(u, 'Services')
    expect(within(servicesView()).getByText(/haircut: 2 sold, \$95 revenue/i)).toBeInTheDocument()
  })

  it('reports total sales and revenue', async () => {
    const u = userEvent.setup()
    render(<App />)
    await sale(u, 'A', 'Color', '10')
    await sale(u, 'B', 'Haircut', '0')
    await nav(u, 'Reports')
    expect(screen.getByText(/total sales: 2/i)).toBeInTheDocument()
    expect(screen.getByText(/total revenue: \$140/i)).toBeInTheDocument()
  })

  it('reports total tips', async () => {
    const u = userEvent.setup()
    render(<App />)
    await sale(u, 'A', 'Color', '10')
    await sale(u, 'B', 'Haircut', '15')
    await nav(u, 'Reports')
    expect(screen.getByText(/total tips: \$25/i)).toBeInTheDocument()
  })

  it('reports the average sale rounded to a whole number', async () => {
    const u = userEvent.setup()
    render(<App />)
    await sale(u, 'A', 'Color', '0') // 90
    await sale(u, 'B', 'Haircut', '0') // 40
    await sale(u, 'C', 'Manicure', '0') // 25 -> total 155 / 3 = 51.67 -> 52
    await nav(u, 'Reports')
    expect(screen.getByText(/average sale: \$52/i)).toBeInTheDocument()
  })

  it('average sale is $0 with no sales', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Reports')
    expect(screen.getByText(/average sale: \$0/i)).toBeInTheDocument()
  })

  it('reports the top service by revenue', async () => {
    const u = userEvent.setup()
    render(<App />)
    await sale(u, 'A', 'Haircut', '0')
    await sale(u, 'B', 'Haircut', '0')
    await sale(u, 'C', 'Color', '0') // haircut 80 vs color 90
    await nav(u, 'Reports')
    expect(screen.getByText(/top service: color/i)).toBeInTheDocument()
  })

  it('top service is None with no sales', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Reports')
    expect(screen.getByText(/top service: none/i)).toBeInTheDocument()
  })

  it('toggles theme via data-theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Reports')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('hides untipped sales when the checkbox is checked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await sale(u, 'Tipper', 'Color', '10')
    await sale(u, 'Cheap', 'Haircut', '0')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide untipped sales/i))
    await nav(u, 'Sales')
    expect(screen.getByText('Tipper: Color $90 + $10 tip')).toBeInTheDocument()
    expect(screen.queryByText('Cheap: Haircut $40 + $0 tip')).not.toBeInTheDocument()
  })

  it('untipped sales still count in Reports when hidden', async () => {
    const u = userEvent.setup()
    render(<App />)
    await sale(u, 'Cheap', 'Haircut', '0')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide untipped sales/i))
    await nav(u, 'Reports')
    expect(screen.getByText(/total sales: 1/i)).toBeInTheDocument()
  })
})
