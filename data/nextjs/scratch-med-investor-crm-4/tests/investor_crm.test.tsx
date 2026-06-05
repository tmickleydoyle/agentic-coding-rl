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

  it('seeds three investors on first render', () => {
    render(<App />)
    expect(screen.getByText('Acme Ventures')).toBeInTheDocument()
    expect(screen.getByText('Blue Capital')).toBeInTheDocument()
    expect(screen.getByText('Crest Fund')).toBeInTheDocument()
  })

  it('shows seeded check sizes formatted with dollar sign', () => {
    render(<App />)
    expect(screen.getByText('$25000')).toBeInTheDocument()
    expect(screen.getByText('$100000')).toBeInTheDocument()
    expect(screen.getByText('$75000')).toBeInTheDocument()
  })

  it('shows Showing: 3 initially with all investors', () => {
    render(<App />)
    expect(screen.getByText('Showing: 3')).toBeInTheDocument()
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

  it('navigates back to Investors view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    await nav(u, 'Investors')
    expect(screen.getByRole('heading', { name: 'Investors' })).toBeInTheDocument()
  })

  it('adds a new investor and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'Delta Partners', '50000', 'pitched')
    expect(screen.getByText('Delta Partners')).toBeInTheDocument()
    expect(screen.getByText('$50000')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4')).toBeInTheDocument()
  })

  it('ignores adding an investor with blank firm', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Firm'))
    await u.type(screen.getByLabelText('Check Size'), '10000')
    await u.click(screen.getByRole('button', { name: /add investor/i }))
    expect(screen.getByText('Showing: 3')).toBeInTheDocument()
  })

  it('ignores adding an investor with zero check size', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Firm'), 'Ghost Fund')
    await u.clear(screen.getByLabelText('Check Size'))
    await u.type(screen.getByLabelText('Check Size'), '0')
    await u.click(screen.getByRole('button', { name: /add investor/i }))
    expect(screen.queryByText('Ghost Fund')).not.toBeInTheDocument()
  })

  it('removes an investor', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove acme ventures/i }))
    expect(screen.queryByText('Acme Ventures')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 2')).toBeInTheDocument()
  })

  it('filters investors by stage', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Stage filter'), 'committed')
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
    expect(screen.getByText('Blue Capital')).toBeInTheDocument()
    expect(screen.queryByText('Acme Ventures')).not.toBeInTheDocument()
    expect(screen.queryByText('Crest Fund')).not.toBeInTheDocument()
  })

  it('filter persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Stage filter'), 'pitched')
    await nav(u, 'Dashboard')
    await nav(u, 'Investors')
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
    expect(screen.getByText('Crest Fund')).toBeInTheDocument()
  })

  it('dashboard shows correct total investors', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total investors: 3')).toBeInTheDocument()
  })

  it('dashboard shows correct stage breakdowns', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Intro: 1')).toBeInTheDocument()
    expect(screen.getByText('Pitched: 1')).toBeInTheDocument()
    expect(screen.getByText('Committed: 1')).toBeInTheDocument()
  })

  it('dashboard shows total committed from seed data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total committed: $100000')).toBeInTheDocument()
  })

  it('dashboard updates when a committed investor is added (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'Echo Equity', '50000', 'committed')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total investors: 4')).toBeInTheDocument()
    expect(screen.getByText('Committed: 2')).toBeInTheDocument()
    expect(screen.getByText('Total committed: $150000')).toBeInTheDocument()
  })

  it('dashboard ignores filter — counts all investors regardless of filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Stage filter'), 'intro')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total investors: 3')).toBeInTheDocument()
    expect(screen.getByText('Pitched: 1')).toBeInTheDocument()
  })

  it('removing an investor updates dashboard totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove blue capital/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total investors: 2')).toBeInTheDocument()
    expect(screen.getByText('Committed: 0')).toBeInTheDocument()
    expect(screen.getByText('Total committed: $0')).toBeInTheDocument()
  })

  it('toggles theme to dark via Settings', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across view navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Investors')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Dashboard')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('investor state persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'Folio Ventures', '30000', 'intro')
    await nav(u, 'Settings')
    await nav(u, 'Investors')
    expect(screen.getByText('Folio Ventures')).toBeInTheDocument()
  })
})
