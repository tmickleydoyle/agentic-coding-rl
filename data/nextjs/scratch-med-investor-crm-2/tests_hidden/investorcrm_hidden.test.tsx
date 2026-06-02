// HELD-OUT generalization tests — fresh scenarios not seen during development.
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
  it('multiple committed investors sum correctly in Summary', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'FundOne', '100000', 'committed')
    await addInvestor(u, 'FundTwo', '250000', 'committed')
    await addInvestor(u, 'FundThree', '50000', 'intro')
    await nav(u, 'Summary')
    expect(screen.getByText('Total committed: $350000')).toBeInTheDocument()
    expect(screen.getByText('Committed: 2')).toBeInTheDocument()
  })

  it('conversion is 100% when all investors are committed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'AllIn', '500000', 'committed')
    await nav(u, 'Summary')
    expect(screen.getByText('Conversion: 100%')).toBeInTheDocument()
  })

  it('filter by committed shows only committed investors', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'IntroFirm', '10000', 'intro')
    await addInvestor(u, 'CommittedFirm', '200000', 'committed')
    await addInvestor(u, 'PitchedFirm', '30000', 'pitched')
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'committed')
    expect(screen.getByRole('heading', { name: /investors \(1\)/i })).toBeInTheDocument()
    expect(screen.getByText('CommittedFirm')).toBeInTheDocument()
    expect(screen.queryByText('IntroFirm')).not.toBeInTheDocument()
  })

  it('removing one of two investors updates the heading count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'Keep', '100000', 'intro')
    await addInvestor(u, 'Delete', '100000', 'intro')
    await u.click(screen.getByRole('button', { name: /remove delete/i }))
    expect(screen.getByRole('heading', { name: /investors \(1\)/i })).toBeInTheDocument()
    expect(screen.queryByText('Delete')).not.toBeInTheDocument()
    expect(screen.getByText('Keep')).toBeInTheDocument()
  })

  it('Summary Intro count is correct after adding intro investors', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'Intro1', '10000', 'intro')
    await addInvestor(u, 'Intro2', '20000', 'intro')
    await nav(u, 'Summary')
    expect(screen.getByText('Intro: 2')).toBeInTheDocument()
    expect(screen.getByText('Pitched: 0')).toBeInTheDocument()
    expect(screen.getByText('Committed: 0')).toBeInTheDocument()
  })

  it('theme toggle back to light works', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('filter by intro while on Investors, then Summary still sees all', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'IntroCo', '40000', 'intro')
    await addInvestor(u, 'PitchCo', '80000', 'pitched')
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'intro')
    expect(screen.getByRole('heading', { name: /investors \(1\)/i })).toBeInTheDocument()
    await nav(u, 'Summary')
    expect(screen.getByText('Total investors: 2')).toBeInTheDocument()
    expect(screen.getByText('Intro: 1')).toBeInTheDocument()
    expect(screen.getByText('Pitched: 1')).toBeInTheDocument()
  })

  it('check size displays correctly as whole dollars with dollar sign', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'BigCheck', '1000000', 'pitched')
    expect(screen.getByText('$1000000')).toBeInTheDocument()
  })

  it('adding after remove updates Summary total correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addInvestor(u, 'TempFund', '300000', 'committed')
    await u.click(screen.getByRole('button', { name: /remove tempfund/i }))
    await addInvestor(u, 'NewFund', '150000', 'committed')
    await nav(u, 'Summary')
    expect(screen.getByText('Total investors: 1')).toBeInTheDocument()
    expect(screen.getByText('Total committed: $150000')).toBeInTheDocument()
    expect(screen.getByText('Conversion: 100%')).toBeInTheDocument()
  })
})
