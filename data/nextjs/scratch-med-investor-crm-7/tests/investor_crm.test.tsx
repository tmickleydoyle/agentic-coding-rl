import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addInvestor(u: U, firm: string, checkSize: string, stage: string) {
  await u.clear(screen.getByLabelText('Firm name'))
  await u.type(screen.getByLabelText('Firm name'), firm)
  await u.clear(screen.getByLabelText('Check size ($)'))
  await u.type(screen.getByLabelText('Check size ($)'), checkSize)
  await u.selectOptions(screen.getByLabelText('Stage'), stage)
  await u.click(screen.getByRole('button', { name: /add investor/i }))
}

describe('Investor CRM app', () => {
  it('starts on the Investors view with seeded data', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /investors \(3\)/i })).toBeInTheDocument()
    expect(screen.getByText('Acme Ventures')).toBeInTheDocument()
    expect(screen.getByText('Blue Horizon')).toBeInTheDocument()
    expect(screen.getByText('Capital Peak')).toBeInTheDocument()
  })

  it('shows seeded check sizes formatted as dollars', () => {
    render(<App />)
    expect(screen.getByText('$50000')).toBeInTheDocument()
    expect(screen.getByText('$100000')).toBeInTheDocument()
    expect(screen.getByText('$250000')).toBeInTheDocument()
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

  it('adds a new investor and updates the count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'Delta Fund', '75000', 'pitched')
    expect(screen.getByRole('heading', { name: /investors \(4\)/i })).toBeInTheDocument()
    expect(screen.getByText('Delta Fund')).toBeInTheDocument()
    expect(screen.getByText('$75000')).toBeInTheDocument()
  })

  it('ignores an investor with a blank firm name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Check size ($)'))
    await u.type(screen.getByLabelText('Check size ($)'), '10000')
    await u.click(screen.getByRole('button', { name: /add investor/i }))
    expect(screen.getByRole('heading', { name: /investors \(3\)/i })).toBeInTheDocument()
  })

  it('ignores an investor with zero check size', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Firm name'), 'Ghost Firm')
    await u.clear(screen.getByLabelText('Check size ($)'))
    await u.type(screen.getByLabelText('Check size ($)'), '0')
    await u.click(screen.getByRole('button', { name: /add investor/i }))
    expect(screen.getByRole('heading', { name: /investors \(3\)/i })).toBeInTheDocument()
  })

  it('removes an investor', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove acme ventures/i }))
    expect(screen.queryByText('Acme Ventures')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /investors \(2\)/i })).toBeInTheDocument()
  })

  it('filters investors by stage', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'committed')
    expect(screen.getByRole('heading', { name: /investors \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Capital Peak')).toBeInTheDocument()
    expect(screen.queryByText('Acme Ventures')).not.toBeInTheDocument()
  })

  it('filter All restores full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'intro')
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'All')
    expect(screen.getByRole('heading', { name: /investors \(3\)/i })).toBeInTheDocument()
  })

  it('updates an investor stage in place', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Stage for Acme Ventures'), 'committed')
    await nav(u, 'Dashboard')
    expect(screen.getByText(/committed: 2/i)).toBeInTheDocument()
  })

  it('dashboard shows correct seeded totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText(/total investors: 3/i)).toBeInTheDocument()
    expect(screen.getByText(/intro: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/pitched: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/committed: 1/i)).toBeInTheDocument()
  })

  it('dashboard total committed reflects only committed stage', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText(/total committed: \$250000/i)).toBeInTheDocument()
  })

  it('dashboard conversion is correct percent', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText(/conversion: 33%/i)).toBeInTheDocument()
  })

  it('dashboard updates after adding a committed investor (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'Echo Capital', '500000', 'committed')
    await nav(u, 'Dashboard')
    expect(screen.getByText(/total investors: 4/i)).toBeInTheDocument()
    expect(screen.getByText(/total committed: \$750000/i)).toBeInTheDocument()
    expect(screen.getByText(/committed: 2/i)).toBeInTheDocument()
  })

  it('dashboard conversion is 0% with no investors', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove acme ventures/i }))
    await u.click(screen.getByRole('button', { name: /remove blue horizon/i }))
    await u.click(screen.getByRole('button', { name: /remove capital peak/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText(/total investors: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/conversion: 0%/i)).toBeInTheDocument()
  })

  it('toggles theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Dashboard')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Investors')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('investor list state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'Foxtrot VC', '30000', 'intro')
    await nav(u, 'Dashboard')
    await nav(u, 'Investors')
    expect(screen.getByText('Foxtrot VC')).toBeInTheDocument()
  })

  it('filter state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'pitched')
    await nav(u, 'Dashboard')
    await nav(u, 'Investors')
    expect(screen.getByRole('heading', { name: /investors \(1\)/i })).toBeInTheDocument()
  })

  it('dashboard total committed is 0 when no committed investors', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove capital peak/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText(/total committed: \$0/i)).toBeInTheDocument()
  })
})
