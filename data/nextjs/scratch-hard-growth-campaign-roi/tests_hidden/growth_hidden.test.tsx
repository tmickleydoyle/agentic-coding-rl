// HELD-OUT generalization tests — overlaid only at eval, never seen by the agent.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))
const channels = () => screen.getByRole('region', { name: 'Channels view' })
const overview = () => screen.getByRole('region', { name: 'Overview view' })

async function addCampaign(
  u: U,
  name: string,
  channel: string,
  spend: string,
  conversions: string,
) {
  await u.clear(screen.getByLabelText(/^name$/i))
  await u.type(screen.getByLabelText(/^name$/i), name)
  await u.selectOptions(screen.getByLabelText(/channel/i), channel)
  await u.clear(screen.getByLabelText(/spend/i))
  if (spend) await u.type(screen.getByLabelText(/spend/i), spend)
  await u.clear(screen.getByLabelText(/conversions/i))
  if (conversions) await u.type(screen.getByLabelText(/conversions/i), conversions)
  await u.click(screen.getByRole('button', { name: /add campaign/i }))
}

describe('Campaign performance (held-out)', () => {
  it('rounds CPA to the nearest whole dollar', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addCampaign(u, 'A', 'Search', '100', '3')
    await nav(u, 'Channels')
    // 100 / 3 = 33.33 -> 33
    expect(
      within(channels()).getByText('Search: $100 spent, 3 conversions, CPA $33'),
    ).toBeInTheDocument()
  })

  it('keeps channels independent in the rollup', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addCampaign(u, 'S', 'Social', '120', '6')
    await addCampaign(u, 'E', 'Email', '90', '3')
    await nav(u, 'Channels')
    expect(
      within(channels()).getByText('Social: $120 spent, 6 conversions, CPA $20'),
    ).toBeInTheDocument()
    expect(
      within(channels()).getByText('Email: $90 spent, 3 conversions, CPA $30'),
    ).toBeInTheDocument()
  })

  it('rounds blended CAC and gives ROAS to one decimal', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addCampaign(u, 'A', 'Search', '700', '20')
    await addCampaign(u, 'B', 'Social', '300', '10')
    await nav(u, 'Overview')
    // CAC = 1000 / 30 = 33.33 -> 33 ; revenue = 30*50 = 1500 ; ROAS = 1.5x
    expect(within(overview()).getByText('Blended CAC: $33')).toBeInTheDocument()
    expect(within(overview()).getByText('Total revenue: $1500')).toBeInTheDocument()
    expect(within(overview()).getByText('ROAS: 1.5x')).toBeInTheDocument()
  })

  it('reports ROAS when spend exists but there are no conversions', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addCampaign(u, 'Burn', 'Display', '400', '0')
    await nav(u, 'Overview')
    expect(within(overview()).getByText('Total revenue: $0')).toBeInTheDocument()
    expect(within(overview()).getByText('ROAS: 0.0x')).toBeInTheDocument()
    expect(within(overview()).getByText('Blended CAC: n/a')).toBeInTheDocument()
  })

  it('unchecking Show active only brings zero-conversion campaigns back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addCampaign(u, 'Dud', 'Display', '100', '0')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show active only/i))
    await u.click(screen.getByLabelText(/show active only/i))
    await nav(u, 'Campaigns')
    expect(screen.getByText('Dud — Display: $100 spent, 0 conversions')).toBeInTheDocument()
  })
})
