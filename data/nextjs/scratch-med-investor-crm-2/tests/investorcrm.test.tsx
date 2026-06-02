import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addInvestor(u: U, firm: string, checkSize: string, stage: string) {
  await u.clear(screen.getByLabelText('Firm'))
  await u.type(screen.getByLabelText('Firm'), firm)
  await u.clear(screen.getByLabelText('Check Size'))
  await u.type(screen.getByLabelText('Check Size'), checkSize)
  await u.selectOptions(screen.getByLabelText('Stage'), stage)
  await u.click(screen.getByRole('button', { name: /add investor/i }))
}

describe('Investor CRM app', () => {
  it('starts on the Investors view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Investors' })).toBeInTheDocument()
  })

  it('shows empty count on start', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /investors \(0\)/i })).toBeInTheDocument()
  })

  it('navigates to Summary view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByRole('heading', { name: 'Summary' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('navigates back to Investors view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Investors')
    expect(screen.getByRole('heading', { name: 'Investors' })).toBeInTheDocument()
  })

  it('adds an investor and shows them in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'Sequoia', '100000', 'intro')
    expect(screen.getByText('Sequoia')).toBeInTheDocument()
    expect(screen.getByText('$100000')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /investors \(1\)/i })).toBeInTheDocument()
  })

  it('ignores add when firm is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Check Size'))
    await u.type(screen.getByLabelText('Check Size'), '50000')
    await u.click(screen.getByRole('button', { name: /add investor/i }))
    expect(screen.getByRole('heading', { name: /investors \(0\)/i })).toBeInTheDocument()
  })

  it('ignores add when check size is zero', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Firm'), 'Acme')
    await u.clear(screen.getByLabelText('Check Size'))
    await u.type(screen.getByLabelText('Check Size'), '0')
    await u.click(screen.getByRole('button', { name: /add investor/i }))
    expect(screen.getByRole('heading', { name: /investors \(0\)/i })).toBeInTheDocument()
  })

  it('removes an investor', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'Andreessen', '200000', 'pitched')
    await u.click(screen.getByRole('button', { name: /remove andreessen/i }))
    expect(screen.queryByText('Andreessen')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /investors \(0\)/i })).toBeInTheDocument()
  })

  it('filters by stage reduces displayed count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'FirmA', '10000', 'intro')
    await addInvestor(u, 'FirmB', '20000', 'pitched')
    await addInvestor(u, 'FirmC', '30000', 'committed')
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'pitched')
    expect(screen.getByRole('heading', { name: /investors \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('FirmB')).toBeInTheDocument()
    expect(screen.queryByText('FirmA')).not.toBeInTheDocument()
    expect(screen.queryByText('FirmC')).not.toBeInTheDocument()
  })

  it('filter all restores full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'FirmX', '10000', 'intro')
    await addInvestor(u, 'FirmY', '20000', 'committed')
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'intro')
    expect(screen.getByRole('heading', { name: /investors \(1\)/i })).toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'all')
    expect(screen.getByRole('heading', { name: /investors \(2\)/i })).toBeInTheDocument()
  })

  it('Summary shows zero stats when empty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total investors: 0')).toBeInTheDocument()
    expect(screen.getByText('Total committed: $0')).toBeInTheDocument()
    expect(screen.getByText('Conversion: 0%')).toBeInTheDocument()
  })

  it('Summary reflects added investors (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'Tiger', '500000', 'committed')
    await addInvestor(u, 'Benchmark', '250000', 'pitched')
    await nav(u, 'Summary')
    expect(screen.getByText('Total investors: 2')).toBeInTheDocument()
    expect(screen.getByText('Pitched: 1')).toBeInTheDocument()
    expect(screen.getByText('Committed: 1')).toBeInTheDocument()
    expect(screen.getByText('Total committed: $500000')).toBeInTheDocument()
  })

  it('Summary conversion rounds to whole percent', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'Alpha', '100000', 'committed')
    await addInvestor(u, 'Beta', '100000', 'intro')
    await addInvestor(u, 'Gamma', '100000', 'intro')
    await nav(u, 'Summary')
    expect(screen.getByText('Conversion: 33%')).toBeInTheDocument()
  })

  it('Summary total committed only sums committed stage', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'InvestA', '100000', 'intro')
    await addInvestor(u, 'InvestB', '200000', 'pitched')
    await addInvestor(u, 'InvestC', '300000', 'committed')
    await nav(u, 'Summary')
    expect(screen.getByText('Total committed: $300000')).toBeInTheDocument()
  })

  it('Summary updates after removing a committed investor', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'Kleiner', '400000', 'committed')
    await u.click(screen.getByRole('button', { name: /remove kleiner/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total investors: 0')).toBeInTheDocument()
    expect(screen.getByText('Total committed: $0')).toBeInTheDocument()
    expect(screen.getByText('Conversion: 0%')).toBeInTheDocument()
  })

  it('filter does not affect Summary counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'FundA', '50000', 'intro')
    await addInvestor(u, 'FundB', '150000', 'committed')
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'intro')
    await nav(u, 'Summary')
    expect(screen.getByText('Total investors: 2')).toBeInTheDocument()
    expect(screen.getByText('Committed: 1')).toBeInTheDocument()
  })

  it('theme toggles to dark and shows data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists when navigating away and back', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Investors')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('investor list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'Persistence Capital', '75000', 'pitched')
    await nav(u, 'Summary')
    await nav(u, 'Investors')
    expect(screen.getByText('Persistence Capital')).toBeInTheDocument()
    expect(screen.getByText('$75000')).toBeInTheDocument()
  })

  it('each investor shows their stage label', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'StageTest', '60000', 'committed')
    const li = screen.getByText('StageTest').closest('li') as HTMLElement
    expect(within(li).getByText('committed')).toBeInTheDocument()
  })
})
