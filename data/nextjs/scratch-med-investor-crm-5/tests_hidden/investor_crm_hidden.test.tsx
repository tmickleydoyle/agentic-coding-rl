// HELD-OUT generalization tests — fresh scenarios for eval only.
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

describe('Investor CRM (held-out)', () => {
  it('displays check size with dollar sign for each stage', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'GrowthCap', 'pitched', '75000')
    expect(within(investorRow('GrowthCap')).getByText('$75000')).toBeInTheDocument()
  })

  it('multiple investors with same stage all appear when filtered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'FundA', 'intro', '10000')
    await addInvestor(u, 'FundB', 'intro', '20000')
    await addInvestor(u, 'FundC', 'pitched', '30000')
    await u.selectOptions(screen.getByLabelText(/filter by stage/i), 'intro')
    expect(screen.getByRole('heading', { name: /investors \(2\)/i })).toBeInTheDocument()
    expect(screen.getByText('FundA')).toBeInTheDocument()
    expect(screen.getByText('FundB')).toBeInTheDocument()
    expect(screen.queryByText('FundC')).not.toBeInTheDocument()
  })

  it('total committed sums multiple committed investors correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'C1', 'committed', '50000')
    await addInvestor(u, 'C2', 'committed', '50000')
    await addInvestor(u, 'C3', 'committed', '50000')
    await nav(u, 'Pipeline')
    expect(screen.getByText(/total committed: \$150000/i)).toBeInTheDocument()
  })

  it('removing an investor reduces the pipeline total investors count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'DeleteFund', 'intro', '40000')
    await addInvestor(u, 'KeepFund', 'intro', '40000')
    await u.click(screen.getByRole('button', { name: /remove deletefund/i }))
    await nav(u, 'Pipeline')
    expect(screen.getByText(/total investors: 1/i)).toBeInTheDocument()
    expect(screen.getByText(/intro: 1/i)).toBeInTheDocument()
  })

  it('filter by committed stage shows only committed investors', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'IntroFirm', 'intro', '10000')
    await addInvestor(u, 'CommitFirm', 'committed', '200000')
    await u.selectOptions(screen.getByLabelText(/filter by stage/i), 'committed')
    expect(screen.getByRole('heading', { name: /investors \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('CommitFirm')).toBeInTheDocument()
    expect(screen.queryByText('IntroFirm')).not.toBeInTheDocument()
  })

  it('pipeline pitched count updates after adding a pitched investor', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'PitchedOne', 'pitched', '90000')
    await addInvestor(u, 'PitchedTwo', 'pitched', '90000')
    await nav(u, 'Pipeline')
    expect(screen.getByText(/pitched: 2/i)).toBeInTheDocument()
  })

  it('theme toggle switches light to dark and shows in attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme toggle can go dark then back to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('investor row shows stage label text', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'StageFirm', 'committed', '123000')
    expect(within(investorRow('StageFirm')).getByText('committed')).toBeInTheDocument()
  })

  it('pipeline total committed excludes intro and pitched check sizes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'I1', 'intro', '999000')
    await addInvestor(u, 'P1', 'pitched', '888000')
    await addInvestor(u, 'Comm', 'committed', '10000')
    await nav(u, 'Pipeline')
    expect(screen.getByText(/total committed: \$10000/i)).toBeInTheDocument()
  })

  it('filter by pitched stage, then switch to All restores full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'Alpha', 'intro', '5000')
    await addInvestor(u, 'Beta', 'pitched', '5000')
    await addInvestor(u, 'Gamma', 'committed', '5000')
    await u.selectOptions(screen.getByLabelText(/filter by stage/i), 'pitched')
    expect(screen.getByRole('heading', { name: /investors \(1\)/i })).toBeInTheDocument()
    await u.selectOptions(screen.getByLabelText(/filter by stage/i), 'All')
    expect(screen.getByRole('heading', { name: /investors \(3\)/i })).toBeInTheDocument()
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
    expect(screen.getByText('Gamma')).toBeInTheDocument()
  })
})
