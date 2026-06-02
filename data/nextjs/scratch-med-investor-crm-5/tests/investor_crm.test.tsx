import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addInvestor(u: U, firm: string, stage: string, checkSize: string) {
  await u.clear(screen.getByLabelText(/firm name/i))
  await u.type(screen.getByLabelText(/firm name/i), firm)
  await u.selectOptions(screen.getByLabelText(/^stage$/i), stage)
  await u.clear(screen.getByLabelText(/check size/i))
  await u.type(screen.getByLabelText(/check size/i), checkSize)
  await u.click(screen.getByRole('button', { name: /add investor/i }))
}

function investorRow(firm: string): HTMLElement {
  const span = screen.getByText(firm)
  const li = span.closest('li')
  if (!li) throw new Error(`no row for ${firm}`)
  return li as HTMLElement
}

describe('Investor CRM app', () => {
  it('starts on the Investors view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /investors \(0\)/i })).toBeInTheDocument()
  })

  it('navigates to all three views', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Pipeline')
    expect(screen.getByRole('heading', { name: 'Pipeline' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Investors')
    expect(screen.getByRole('heading', { name: /investors/i })).toBeInTheDocument()
  })

  it('adds an investor and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'Sequoia', 'intro', '100000')
    expect(screen.getByText('Sequoia')).toBeInTheDocument()
    expect(within(investorRow('Sequoia')).getByText('$100000')).toBeInTheDocument()
    expect(within(investorRow('Sequoia')).getByText('intro')).toBeInTheDocument()
  })

  it('heading count increments when investor is added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'Andreessen', 'pitched', '250000')
    expect(screen.getByRole('heading', { name: /investors \(1\)/i })).toBeInTheDocument()
    await addInvestor(u, 'Benchmark', 'committed', '500000')
    expect(screen.getByRole('heading', { name: /investors \(2\)/i })).toBeInTheDocument()
  })

  it('ignores blank firm name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/check size/i), '50000')
    await u.click(screen.getByRole('button', { name: /add investor/i }))
    expect(screen.getByRole('heading', { name: /investors \(0\)/i })).toBeInTheDocument()
  })

  it('ignores zero or negative check size', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/firm name/i), 'BadFirm')
    await u.type(screen.getByLabelText(/check size/i), '0')
    await u.click(screen.getByRole('button', { name: /add investor/i }))
    expect(screen.getByRole('heading', { name: /investors \(0\)/i })).toBeInTheDocument()
  })

  it('removes an investor', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'Tiger Global', 'pitched', '75000')
    expect(screen.getByText('Tiger Global')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /remove tiger global/i }))
    expect(screen.queryByText('Tiger Global')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /investors \(0\)/i })).toBeInTheDocument()
  })

  it('filters by stage and updates heading count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'FirmA', 'intro', '10000')
    await addInvestor(u, 'FirmB', 'committed', '200000')
    await addInvestor(u, 'FirmC', 'intro', '30000')
    await u.selectOptions(screen.getByLabelText(/filter by stage/i), 'intro')
    expect(screen.getByRole('heading', { name: /investors \(2\)/i })).toBeInTheDocument()
    expect(screen.getByText('FirmA')).toBeInTheDocument()
    expect(screen.getByText('FirmC')).toBeInTheDocument()
    expect(screen.queryByText('FirmB')).not.toBeInTheDocument()
  })

  it('filter All shows every investor', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'X', 'intro', '5000')
    await addInvestor(u, 'Y', 'committed', '15000')
    await u.selectOptions(screen.getByLabelText(/filter by stage/i), 'pitched')
    expect(screen.getByRole('heading', { name: /investors \(0\)/i })).toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText(/filter by stage/i), 'All')
    expect(screen.getByRole('heading', { name: /investors \(2\)/i })).toBeInTheDocument()
  })

  it('pipeline totals reflect all investors regardless of filter (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'AlphaFund', 'committed', '100000')
    await addInvestor(u, 'BetaFund', 'intro', '50000')
    await u.selectOptions(screen.getByLabelText(/filter by stage/i), 'committed')
    // heading shows 1 (filtered), but pipeline must show 2
    expect(screen.getByRole('heading', { name: /investors \(1\)/i })).toBeInTheDocument()
    await nav(u, 'Pipeline')
    expect(screen.getByText(/total investors: 2/i)).toBeInTheDocument()
    expect(screen.getByText(/intro: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/committed: 1/i)).toBeInTheDocument()
  })

  it('pipeline shows Total committed: $0 when no committed investors', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'EarlyVC', 'intro', '20000')
    await nav(u, 'Pipeline')
    expect(screen.getByText(/total committed: \$0/i)).toBeInTheDocument()
  })

  it('pipeline sums only committed check sizes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'VC1', 'committed', '100000')
    await addInvestor(u, 'VC2', 'committed', '150000')
    await addInvestor(u, 'VC3', 'pitched', '999999')
    await nav(u, 'Pipeline')
    expect(screen.getByText(/total committed: \$250000/i)).toBeInTheDocument()
  })

  it('pipeline updates after removing a committed investor', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'RemoveMe', 'committed', '300000')
    await addInvestor(u, 'KeepMe', 'committed', '200000')
    await u.click(screen.getByRole('button', { name: /remove removeme/i }))
    await nav(u, 'Pipeline')
    expect(screen.getByText(/total committed: \$200000/i)).toBeInTheDocument()
    expect(screen.getByText(/committed: 1/i)).toBeInTheDocument()
  })

  it('pipeline stage counts are correct', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'I1', 'intro', '10000')
    await addInvestor(u, 'I2', 'intro', '20000')
    await addInvestor(u, 'P1', 'pitched', '30000')
    await addInvestor(u, 'C1', 'committed', '40000')
    await nav(u, 'Pipeline')
    expect(screen.getByText(/total investors: 4/i)).toBeInTheDocument()
    expect(screen.getByText(/intro: 2/i)).toBeInTheDocument()
    expect(screen.getByText(/pitched: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/committed: 1/i)).toBeInTheDocument()
  })

  it('state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'Persistent', 'pitched', '60000')
    await nav(u, 'Pipeline')
    await nav(u, 'Investors')
    expect(screen.getByText('Persistent')).toBeInTheDocument()
  })

  it('toggles theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Pipeline')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Investors')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('filter persists when returning to Investors view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'StayFirm', 'committed', '80000')
    await u.selectOptions(screen.getByLabelText(/filter by stage/i), 'intro')
    await nav(u, 'Pipeline')
    await nav(u, 'Investors')
    // filter should still be intro so StayFirm (committed) is hidden
    expect(screen.queryByText('StayFirm')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /investors \(0\)/i })).toBeInTheDocument()
  })

  it('pipeline empty state shows all zeros', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Pipeline')
    expect(screen.getByText(/total investors: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/intro: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/pitched: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/committed: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/total committed: \$0/i)).toBeInTheDocument()
  })
})
