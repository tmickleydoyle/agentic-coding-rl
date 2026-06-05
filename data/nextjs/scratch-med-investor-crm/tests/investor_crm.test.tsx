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

describe('Investor CRM app', () => {
  it('starts on the Investors view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /investors/i })).toBeInTheDocument()
  })

  it('seeds three investors on load', () => {
    render(<App />)
    expect(screen.getByText('Sequoia')).toBeInTheDocument()
    expect(screen.getByText('Accel')).toBeInTheDocument()
    expect(screen.getByText('Lightspeed')).toBeInTheDocument()
  })

  it('shows seeded investors count in heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /investors \(3\)/i })).toBeInTheDocument()
  })

  it('shows seeded check sizes formatted as dollars', () => {
    render(<App />)
    expect(screen.getByText('$500,000')).toBeInTheDocument()
    expect(screen.getByText('$250,000')).toBeInTheDocument()
    expect(screen.getByText('$100,000')).toBeInTheDocument()
  })

  it('navigates to Dashboard view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('adds a new investor', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'Benchmark', 'pitched', '75000')
    expect(screen.getByText('Benchmark')).toBeInTheDocument()
    expect(screen.getByText('$75,000')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /investors \(4\)/i })).toBeInTheDocument()
  })

  it('ignores blank firm name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Firm'))
    await u.type(screen.getByLabelText('Check size'), '50000')
    await u.click(screen.getByRole('button', { name: /add investor/i }))
    expect(screen.getByRole('heading', { name: /investors \(3\)/i })).toBeInTheDocument()
  })

  it('ignores zero or negative check size', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Firm'), 'Ghost')
    await u.type(screen.getByLabelText('Check size'), '0')
    await u.click(screen.getByRole('button', { name: /add investor/i }))
    expect(screen.getByRole('heading', { name: /investors \(3\)/i })).toBeInTheDocument()
  })

  it('removes an investor', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove accel/i }))
    expect(screen.queryByText('Accel')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /investors \(2\)/i })).toBeInTheDocument()
  })

  it('filters by stage intro', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'intro')
    expect(screen.getByRole('heading', { name: /investors \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Lightspeed')).toBeInTheDocument()
    expect(screen.queryByText('Sequoia')).not.toBeInTheDocument()
    expect(screen.queryByText('Accel')).not.toBeInTheDocument()
  })

  it('filters by stage committed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'committed')
    expect(screen.getByRole('heading', { name: /investors \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Sequoia')).toBeInTheDocument()
  })

  it('filter All restores full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'pitched')
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'All')
    expect(screen.getByRole('heading', { name: /investors \(3\)/i })).toBeInTheDocument()
  })

  it('dashboard shows total investors', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total investors: 3')).toBeInTheDocument()
  })

  it('dashboard shows stage breakdown', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Intro: 1')).toBeInTheDocument()
    expect(screen.getByText('Pitched: 1')).toBeInTheDocument()
    expect(screen.getByText('Committed: 1')).toBeInTheDocument()
  })

  it('dashboard shows total committed dollars', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total committed: $500,000')).toBeInTheDocument()
  })

  it('dashboard updates after adding a committed investor (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'NEA', 'committed', '200000')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total investors: 4')).toBeInTheDocument()
    expect(screen.getByText('Committed: 2')).toBeInTheDocument()
    expect(screen.getByText('Total committed: $700,000')).toBeInTheDocument()
  })

  it('dashboard ignores active filter (shows all investors)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'intro')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total investors: 3')).toBeInTheDocument()
  })

  it('toggles theme and applies data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Dashboard')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Investors')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('investor list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'GV', 'intro', '150000')
    await nav(u, 'Dashboard')
    await nav(u, 'Investors')
    expect(screen.getByText('GV')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /investors \(4\)/i })).toBeInTheDocument()
  })

  it('total committed is $0 when no committed investors', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove sequoia/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total committed: $0')).toBeInTheDocument()
  })
})
