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

function invRow(firm: string): HTMLElement {
  const el = screen.getByText(firm).closest('li')
  if (!el) throw new Error(`no row for ${firm}`)
  return el as HTMLElement
}

describe('Investor CRM app', () => {
  it('starts on the Investors view with seeded data', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Investors' })).toBeInTheDocument()
    expect(screen.getByText('Acme Ventures')).toBeInTheDocument()
    expect(screen.getByText('Blue Horizon')).toBeInTheDocument()
    expect(screen.getByText('Crestwood Capital')).toBeInTheDocument()
  })

  it('shows Showing: 3 for the seeded data', () => {
    render(<App />)
    expect(screen.getByText('Showing: 3')).toBeInTheDocument()
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
    expect(screen.getByText('$25000')).toBeInTheDocument()
    expect(screen.getByText('$100000')).toBeInTheDocument()
    expect(screen.getByText('$500000')).toBeInTheDocument()
  })

  it('adds a new investor and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'Delta Fund', 'pitched', '75000')
    expect(screen.getByText('Delta Fund')).toBeInTheDocument()
    expect(screen.getByText('$75000')).toBeInTheDocument()
    expect(screen.getByText('Showing: 4')).toBeInTheDocument()
  })

  it('ignores a blank firm name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Check size'))
    await u.type(screen.getByLabelText('Check size'), '50000')
    await u.click(screen.getByRole('button', { name: /add investor/i }))
    expect(screen.getByText('Showing: 3')).toBeInTheDocument()
  })

  it('ignores a zero check size', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Firm'), 'Ghost Corp')
    await u.clear(screen.getByLabelText('Check size'))
    await u.type(screen.getByLabelText('Check size'), '0')
    await u.click(screen.getByRole('button', { name: /add investor/i }))
    expect(screen.getByText('Showing: 3')).toBeInTheDocument()
  })

  it('removes an investor', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(invRow('Blue Horizon')).getByRole('button', { name: /remove blue horizon/i }))
    expect(screen.queryByText('Blue Horizon')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 2')).toBeInTheDocument()
  })

  it('updates stage with the Edit stage select', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(
      within(invRow('Acme Ventures')).getByRole('combobox', { name: /edit stage acme ventures/i }),
      'committed'
    )
    expect(within(invRow('Acme Ventures')).getByDisplayValue('committed')).toBeInTheDocument()
  })

  it('filters by stage intro', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'intro')
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
    expect(screen.getByText('Acme Ventures')).toBeInTheDocument()
    expect(screen.queryByText('Blue Horizon')).not.toBeInTheDocument()
  })

  it('filters by stage committed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'committed')
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
    expect(screen.getByText('Crestwood Capital')).toBeInTheDocument()
    expect(screen.queryByText('Acme Ventures')).not.toBeInTheDocument()
  })

  it('shows All resets the filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'pitched')
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'All')
    expect(screen.getByText('Showing: 3')).toBeInTheDocument()
  })

  it('Summary shows correct seeded stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total investors: 3')).toBeInTheDocument()
    expect(screen.getByText('Intro: 1')).toBeInTheDocument()
    expect(screen.getByText('Pitched: 1')).toBeInTheDocument()
    expect(screen.getByText('Committed: 1')).toBeInTheDocument()
    expect(screen.getByText('Total committed: $500000')).toBeInTheDocument()
  })

  it('Summary updates after adding a committed investor (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'Echo Partners', 'committed', '200000')
    await nav(u, 'Summary')
    expect(screen.getByText('Total investors: 4')).toBeInTheDocument()
    expect(screen.getByText('Committed: 2')).toBeInTheDocument()
    expect(screen.getByText('Total committed: $700000')).toBeInTheDocument()
  })

  it('Summary reflects removal of an investor', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(invRow('Crestwood Capital')).getByRole('button', { name: /remove crestwood capital/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total investors: 2')).toBeInTheDocument()
    expect(screen.getByText('Committed: 0')).toBeInTheDocument()
    expect(screen.getByText('Total committed: $0')).toBeInTheDocument()
  })

  it('Summary reflects a stage edit cross-view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(
      within(invRow('Blue Horizon')).getByRole('combobox', { name: /edit stage blue horizon/i }),
      'committed'
    )
    await nav(u, 'Summary')
    expect(screen.getByText('Committed: 2')).toBeInTheDocument()
    expect(screen.getByText('Pitched: 0')).toBeInTheDocument()
    expect(screen.getByText('Total committed: $600000')).toBeInTheDocument()
  })

  it('toggles theme to dark and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('Investor state is preserved when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'Persisted LLC', 'intro', '10000')
    await nav(u, 'Summary')
    await nav(u, 'Investors')
    expect(screen.getByText('Persisted LLC')).toBeInTheDocument()
  })
})
