// HELD-OUT generalization tests — fresh scenarios not seen during development.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addInvestor(u: U, firm: string, stage: string, checkSize: string) {
  await u.clear(screen.getByLabelText('Firm'))
  await u.type(screen.getByLabelText('Firm'), firm)
  await u.selectOptions(screen.getByLabelText('Stage'), stage)
  await u.clear(screen.getByLabelText('Check size'))
  await u.type(screen.getByLabelText('Check size'), checkSize)
  await u.click(screen.getByRole('button', { name: /add investor/i }))
}

describe('Investor CRM (held-out)', () => {
  it('filter by pitched shows only pitched investors', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'pitched')
    expect(screen.getByRole('heading', { name: /investors \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Accel')).toBeInTheDocument()
    expect(screen.queryByText('Sequoia')).not.toBeInTheDocument()
    expect(screen.queryByText('Lightspeed')).not.toBeInTheDocument()
  })

  it('removing a filtered-out investor still updates total count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'intro')
    // Accel is pitched so not visible — remove via All first
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'All')
    await u.click(screen.getByRole('button', { name: /remove accel/i }))
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'intro')
    expect(screen.getByRole('heading', { name: /investors \(1\)/i })).toBeInTheDocument()
  })

  it('adding two committed investors sums correctly in dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'Tiger', 'committed', '300000')
    await addInvestor(u, 'Coatue', 'committed', '200000')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total committed: $1,000,000')).toBeInTheDocument()
    expect(screen.getByText('Committed: 3')).toBeInTheDocument()
  })

  it('removing a committed investor reduces total committed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total committed: $500,000')).toBeInTheDocument()
    await nav(u, 'Investors')
    await u.click(screen.getByRole('button', { name: /remove sequoia/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total committed: $0')).toBeInTheDocument()
    expect(screen.getByText('Committed: 0')).toBeInTheDocument()
  })

  it('dashboard total investors reflects additions and removals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'Greylock', 'intro', '80000')
    await u.click(screen.getByRole('button', { name: /remove lightspeed/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total investors: 3')).toBeInTheDocument()
  })

  it('filter count updates after adding investor of that stage', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'IVP', 'intro', '120000')
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'intro')
    expect(screen.getByRole('heading', { name: /investors \(2\)/i })).toBeInTheDocument()
  })

  it('newly added investor check size appears formatted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'Kleiner', 'pitched', '1000000')
    expect(screen.getByText('$1,000,000')).toBeInTheDocument()
  })

  it('double theme toggle returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('intro count on dashboard updates when intro investor is removed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove lightspeed/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Intro: 0')).toBeInTheDocument()
  })

  it('pitched count on dashboard updates when pitched investor is added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'Spark', 'pitched', '60000')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Pitched: 2')).toBeInTheDocument()
  })
})
