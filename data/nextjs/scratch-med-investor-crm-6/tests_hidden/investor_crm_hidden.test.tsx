// HELD-OUT generalization tests — fresh scenarios and edge cases.
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

describe('Investor CRM (held-out)', () => {
  it('filter by pitched shows only Blue Horizon initially', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'pitched')
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
    expect(screen.queryByText('Acme Ventures')).not.toBeInTheDocument()
    expect(screen.getByText('Blue Horizon')).toBeInTheDocument()
    expect(screen.queryByText('Crestwood Capital')).not.toBeInTheDocument()
  })

  it('adding two committed investors sums correctly in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'Fund A', 'committed', '300000')
    await addInvestor(u, 'Fund B', 'committed', '150000')
    await nav(u, 'Summary')
    // seeded committed 500000 + 300000 + 150000 = 950000
    expect(screen.getByText('Total committed: $950000')).toBeInTheDocument()
    expect(screen.getByText('Committed: 3')).toBeInTheDocument()
  })

  it('editing a committed investor to intro removes it from committed total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(
      within(invRow('Crestwood Capital')).getByRole('combobox', { name: /edit stage crestwood capital/i }),
      'intro'
    )
    await nav(u, 'Summary')
    expect(screen.getByText('Total committed: $0')).toBeInTheDocument()
    expect(screen.getByText('Committed: 0')).toBeInTheDocument()
    expect(screen.getByText('Intro: 2')).toBeInTheDocument()
  })

  it('filter count updates after adding investor matching the active filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'intro')
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
    await addInvestor(u, 'New Intro Fund', 'intro', '50000')
    expect(screen.getByText('Showing: 2')).toBeInTheDocument()
  })

  it('removing a committed investor reduces Summary total committed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'Temp Capital', 'committed', '80000')
    await u.click(within(invRow('Temp Capital')).getByRole('button', { name: /remove temp capital/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total committed: $500000')).toBeInTheDocument()
    expect(screen.getByText('Committed: 1')).toBeInTheDocument()
  })

  it('filter does not affect Summary counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'intro')
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
    await nav(u, 'Summary')
    expect(screen.getByText('Total investors: 3')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('shows $0 total committed after removing seeded committed record and no others committed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(invRow('Crestwood Capital')).getByRole('button', { name: /remove crestwood capital/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total committed: $0')).toBeInTheDocument()
  })

  it('Showing count resets after switching filter back to All', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'committed')
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'All')
    expect(screen.getByText('Showing: 3')).toBeInTheDocument()
  })
})
