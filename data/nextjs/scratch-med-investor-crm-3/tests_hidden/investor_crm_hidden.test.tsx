// HELD-OUT generalization tests — fresh scenarios and edge cases not covered by visible suite.
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

describe('Investor CRM (held-out)', () => {
  it('seeded Sequoia is committed stage', () => {
    render(<App />)
    expect(within(invRow('Sequoia')).getByDisplayValue('committed')).toBeInTheDocument()
  })

  it('seeded Y Combinator check size is shown', () => {
    render(<App />)
    expect(within(invRow('Y Combinator')).getByText('$125000')).toBeInTheDocument()
  })

  it('filter by intro hides pitched and committed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'intro')
    expect(screen.queryByText('Sequoia')).not.toBeInTheDocument()
    expect(screen.queryByText('Accel')).not.toBeInTheDocument()
    expect(screen.getByText('Y Combinator')).toBeInTheDocument()
  })

  it('count in heading reflects filter', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'pitched')
    expect(screen.getByRole('heading', { name: /investors \(1\)/i })).toBeInTheDocument()
  })

  it('adding two committed investors updates total committed correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'GV', 'committed', '200000')
    await addInvestor(u, 'a16z', 'committed', '300000')
    await nav(u, 'Summary')
    // Sequoia 500000 + GV 200000 + a16z 300000 = 1000000
    expect(screen.getByText('Total committed: $1000000')).toBeInTheDocument()
    expect(screen.getByText('Committed: 3')).toBeInTheDocument()
  })

  it('removing a committed investor reduces total committed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove sequoia/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total committed: $0')).toBeInTheDocument()
    expect(screen.getByText('Committed: 0')).toBeInTheDocument()
  })

  it('Summary total investors updates after removal', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove accel/i }))
    await u.click(screen.getByRole('button', { name: /remove y combinator/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total investors: 1')).toBeInTheDocument()
  })

  it('average check updates after adding an investor', async () => {
    const u = userEvent.setup()
    render(<App />)
    // remove seeded so only 1 new entry
    await u.click(screen.getByRole('button', { name: /remove sequoia/i }))
    await u.click(screen.getByRole('button', { name: /remove accel/i }))
    await u.click(screen.getByRole('button', { name: /remove y combinator/i }))
    await addInvestor(u, 'OnlyFund', 'intro', '100000')
    await nav(u, 'Summary')
    expect(screen.getByText('Average check: $100000')).toBeInTheDocument()
  })

  it('stage change to committed updates total committed in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Accel is pitched (250000), move to committed
    await u.selectOptions(screen.getByLabelText('Stage for Accel'), 'committed')
    await u.selectOptions(screen.getByLabelText('Stage for Y Combinator'), 'committed')
    await nav(u, 'Summary')
    // 500000 + 250000 + 125000 = 875000
    expect(screen.getByText('Total committed: $875000')).toBeInTheDocument()
    expect(screen.getByText('Committed: 3')).toBeInTheDocument()
  })

  it('theme toggle applies dark, toggle again returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('adding investor with intro stage increments Intro count in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'NewFund', 'intro', '50000')
    await nav(u, 'Summary')
    expect(screen.getByText('Intro: 2')).toBeInTheDocument()
  })

  it('all three stage filters work sequentially without resetting data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'committed')
    expect(screen.getByRole('heading', { name: /investors \(1\)/i })).toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'intro')
    expect(screen.getByRole('heading', { name: /investors \(1\)/i })).toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'All')
    expect(screen.getByRole('heading', { name: /investors \(3\)/i })).toBeInTheDocument()
  })
})
