import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

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

const channels = () => screen.getByRole('region', { name: 'Channels view' })
const overview = () => screen.getByRole('region', { name: 'Overview view' })

describe('Campaign performance app', () => {
  it('starts on Campaigns', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Campaigns' })).toBeInTheDocument()
  })

  it('navigates to every view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Channels')
    expect(screen.getByRole('heading', { name: 'Channels' })).toBeInTheDocument()
    await nav(u, 'Overview')
    expect(screen.getByRole('heading', { name: 'Overview' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Campaigns')
    expect(screen.getByRole('heading', { name: 'Campaigns' })).toBeInTheDocument()
  })

  it('adds a campaign rendered as a single summary line', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addCampaign(u, 'Spring Sale', 'Search', '400', '8')
    expect(
      screen.getByText('Spring Sale — Search: $400 spent, 8 conversions'),
    ).toBeInTheDocument()
  })

  it('allows zero spend and zero conversions', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addCampaign(u, 'Teaser', 'Social', '0', '0')
    expect(screen.getByText('Teaser — Social: $0 spent, 0 conversions')).toBeInTheDocument()
  })

  it('ignores a campaign with negative spend', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addCampaign(u, 'Bad', 'Email', '-5', '2')
    await nav(u, 'Overview')
    expect(within(overview()).getByText(/total spend: \$0/i)).toBeInTheDocument()
  })

  it('rolls spend and conversions up per channel (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addCampaign(u, 'A', 'Search', '300', '6')
    await addCampaign(u, 'B', 'Search', '300', '4')
    await nav(u, 'Channels')
    expect(
      within(channels()).getByText('Search: $600 spent, 10 conversions, CPA $60'),
    ).toBeInTheDocument()
  })

  it('shows CPA n/a for a channel with no conversions', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addCampaign(u, 'Awareness', 'Display', '200', '0')
    await nav(u, 'Channels')
    expect(
      within(channels()).getByText('Display: $200 spent, 0 conversions, CPA n/a'),
    ).toBeInTheDocument()
  })

  it('lists only channels that have campaigns', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addCampaign(u, 'Only', 'Email', '100', '5')
    await nav(u, 'Channels')
    expect(within(channels()).getByText(/^Email:/)).toBeInTheDocument()
    expect(within(channels()).queryByText(/^Search:/)).not.toBeInTheDocument()
    expect(within(channels()).queryByText(/^Social:/)).not.toBeInTheDocument()
  })

  it('computes overview totals, revenue, blended CAC and ROAS', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addCampaign(u, 'A', 'Search', '500', '10')
    await addCampaign(u, 'B', 'Social', '500', '10')
    await nav(u, 'Overview')
    expect(within(overview()).getByText('Total spend: $1000')).toBeInTheDocument()
    expect(within(overview()).getByText('Total conversions: 20')).toBeInTheDocument()
    expect(within(overview()).getByText('Total revenue: $1000')).toBeInTheDocument()
    expect(within(overview()).getByText('Blended CAC: $50')).toBeInTheDocument()
    expect(within(overview()).getByText('ROAS: 1.0x')).toBeInTheDocument()
  })

  it('shows ROAS above 1 when revenue beats spend', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addCampaign(u, 'Winner', 'Search', '200', '10')
    await nav(u, 'Overview')
    expect(within(overview()).getByText('Total revenue: $500')).toBeInTheDocument()
    expect(within(overview()).getByText('ROAS: 2.5x')).toBeInTheDocument()
  })

  it('shows Blended CAC n/a and ROAS n/a with no usable data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Overview')
    expect(within(overview()).getByText('Blended CAC: n/a')).toBeInTheDocument()
    expect(within(overview()).getByText('ROAS: n/a')).toBeInTheDocument()
  })

  it('toggles theme via data-theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Overview')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('hides zero-conversion campaigns when Show active only is checked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addCampaign(u, 'Converter', 'Search', '100', '4')
    await addCampaign(u, 'Dud', 'Display', '100', '0')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show active only/i))
    await nav(u, 'Campaigns')
    expect(
      screen.getByText('Converter — Search: $100 spent, 4 conversions'),
    ).toBeInTheDocument()
    expect(
      screen.queryByText('Dud — Display: $100 spent, 0 conversions'),
    ).not.toBeInTheDocument()
  })

  it('keeps hidden campaigns counted in the overview', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addCampaign(u, 'Converter', 'Search', '100', '4')
    await addCampaign(u, 'Dud', 'Display', '300', '0')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show active only/i))
    await nav(u, 'Overview')
    expect(within(overview()).getByText('Total spend: $400')).toBeInTheDocument()
  })
})
