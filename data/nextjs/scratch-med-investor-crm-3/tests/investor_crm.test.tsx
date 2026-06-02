import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

function invRow(firm: string): HTMLElement {
  const el = screen.getByText(firm).closest('li')
  if (!el) throw new Error(`no row for ${firm}`)
  return el as HTMLElement
}

async function addInvestor(u: U, firm: string, stage: string, checkSize: string) {
  await u.clear(screen.getByLabelText('Firm'))
  await u.type(screen.getByLabelText('Firm'), firm)
  await u.selectOptions(screen.getByLabelText('Stage'), stage)
  await u.clear(screen.getByLabelText('Check size'))
  await u.type(screen.getByLabelText('Check size'), checkSize)
  await u.click(screen.getByRole('button', { name: /add investor/i }))
}

describe('Investor CRM app', () => {
  it('starts on the Investors view with seeded data', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /investors \(3\)/i })).toBeInTheDocument()
    expect(screen.getByText('Sequoia')).toBeInTheDocument()
    expect(screen.getByText('Accel')).toBeInTheDocument()
    expect(screen.getByText('Y Combinator')).toBeInTheDocument()
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

  it('shows seeded check sizes formatted with dollar sign', () => {
    render(<App />)
    expect(within(invRow('Sequoia')).getByText('$500000')).toBeInTheDocument()
    expect(within(invRow('Accel')).getByText('$250000')).toBeInTheDocument()
  })

  it('adds a new investor and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'Tiger Global', 'pitched', '300000')
    expect(screen.getByText('Tiger Global')).toBeInTheDocument()
    expect(within(invRow('Tiger Global')).getByText('$300000')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /investors \(4\)/i })).toBeInTheDocument()
  })

  it('ignores an investor with a blank firm name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Check size'))
    await u.type(screen.getByLabelText('Check size'), '100000')
    await u.click(screen.getByRole('button', { name: /add investor/i }))
    expect(screen.getByRole('heading', { name: /investors \(3\)/i })).toBeInTheDocument()
  })

  it('ignores an investor with zero check size', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Firm'), 'Ghost Fund')
    await u.clear(screen.getByLabelText('Check size'))
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

  it('filters investors by stage', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'committed')
    expect(screen.getByRole('heading', { name: /investors \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('Sequoia')).toBeInTheDocument()
    expect(screen.queryByText('Accel')).not.toBeInTheDocument()
  })

  it('filter All shows all investors', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'pitched')
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'All')
    expect(screen.getByRole('heading', { name: /investors \(3\)/i })).toBeInTheDocument()
  })

  it('changes stage in-place for an investor', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Stage for Accel'), 'committed')
    expect(within(invRow('Accel')).getByDisplayValue('committed')).toBeInTheDocument()
  })

  it('Summary shows correct total investors', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total investors: 3')).toBeInTheDocument()
  })

  it('Summary shows correct stage counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Intro: 1')).toBeInTheDocument()
    expect(screen.getByText('Pitched: 1')).toBeInTheDocument()
    expect(screen.getByText('Committed: 1')).toBeInTheDocument()
  })

  it('Summary shows total committed for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total committed: $500000')).toBeInTheDocument()
  })

  it('Summary shows average check for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    // (500000 + 250000 + 125000) / 3 = 291667 rounded
    expect(screen.getByText('Average check: $291667')).toBeInTheDocument()
  })

  it('Summary reflects a new committed investor (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'Benchmark', 'committed', '400000')
    await nav(u, 'Summary')
    expect(screen.getByText('Total investors: 4')).toBeInTheDocument()
    expect(screen.getByText('Committed: 2')).toBeInTheDocument()
    expect(screen.getByText('Total committed: $900000')).toBeInTheDocument()
  })

  it('Summary shows $0 average when all investors removed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove sequoia/i }))
    await u.click(screen.getByRole('button', { name: /remove accel/i }))
    await u.click(screen.getByRole('button', { name: /remove y combinator/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Average check: $0')).toBeInTheDocument()
    expect(screen.getByText('Total committed: $0')).toBeInTheDocument()
  })

  it('stage change in Investors updates Summary counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Stage for Accel'), 'committed')
    await nav(u, 'Summary')
    expect(screen.getByText('Committed: 2')).toBeInTheDocument()
    expect(screen.getByText('Pitched: 0')).toBeInTheDocument()
    expect(screen.getByText('Total committed: $750000')).toBeInTheDocument()
  })

  it('toggles theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Investors')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('filter persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'intro')
    await nav(u, 'Summary')
    await nav(u, 'Investors')
    expect(screen.getByLabelText('Filter by stage')).toHaveValue('intro')
    expect(screen.getByRole('heading', { name: /investors \(1\)/i })).toBeInTheDocument()
  })
})
