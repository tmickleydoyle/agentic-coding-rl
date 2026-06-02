// HELD-OUT generalization tests — used only at eval, never seen during generation.
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

describe('Investor CRM (held-out)', () => {
  it('intro filter shows only intro investors', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Stage filter'), 'intro')
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
    expect(screen.getByText('Acme Ventures')).toBeInTheDocument()
    expect(screen.queryByText('Blue Capital')).not.toBeInTheDocument()
  })

  it('pitched filter shows only pitched investors', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Stage filter'), 'pitched')
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
    expect(screen.getByText('Crest Fund')).toBeInTheDocument()
    expect(screen.queryByText('Acme Ventures')).not.toBeInTheDocument()
  })

  it('resetting filter to All shows all investors', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Stage filter'), 'committed')
    await u.selectOptions(screen.getByLabelText('Stage filter'), 'All')
    expect(screen.getByText('Showing: 3')).toBeInTheDocument()
  })

  it('adding two committed investors sums total committed correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'Fund Alpha', '200000', 'committed')
    await addInvestor(u, 'Fund Beta', '50000', 'committed')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total committed: $350000')).toBeInTheDocument()
    expect(screen.getByText('Committed: 3')).toBeInTheDocument()
  })

  it('removing a pitched investor decreases Pitched count on dashboard', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove crest fund/i }))
    await nav(u, 'Dashboard')
    expect(screen.getByText('Pitched: 0')).toBeInTheDocument()
    expect(screen.getByText('Total investors: 2')).toBeInTheDocument()
  })

  it('negative check size is rejected', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Firm'), 'Bad Fund')
    await u.clear(screen.getByLabelText('Check Size'))
    await u.type(screen.getByLabelText('Check Size'), '-5000')
    await u.click(screen.getByRole('button', { name: /add investor/i }))
    expect(screen.queryByText('Bad Fund')).not.toBeInTheDocument()
    expect(screen.getByText('Showing: 3')).toBeInTheDocument()
  })

  it('filter count updates correctly after a removal', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'Second Intro', '10000', 'intro')
    await u.selectOptions(screen.getByLabelText('Stage filter'), 'intro')
    expect(screen.getByText('Showing: 2')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /remove acme ventures/i }))
    expect(screen.getByText('Showing: 1')).toBeInTheDocument()
  })

  it('dashboard Intro count increases when an intro investor is added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'New Intro Fund', '15000', 'intro')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Intro: 2')).toBeInTheDocument()
    expect(screen.getByText('Total investors: 4')).toBeInTheDocument()
  })

  it('total committed stays same when pitched investor added', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'Pitched Only', '999000', 'pitched')
    await nav(u, 'Dashboard')
    expect(screen.getByText('Total committed: $100000')).toBeInTheDocument()
  })

  it('initial theme is light', () => {
    const { container } = render(<App />)
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })
})
