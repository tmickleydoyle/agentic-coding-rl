import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addReferral(
  u: U,
  referrer: string,
  source: string,
  invites: string,
  signups: string,
) {
  await u.clear(screen.getByLabelText(/referrer/i))
  await u.type(screen.getByLabelText(/referrer/i), referrer)
  await u.selectOptions(screen.getByLabelText(/source/i), source)
  await u.clear(screen.getByLabelText(/invites/i))
  if (invites) await u.type(screen.getByLabelText(/invites/i), invites)
  await u.clear(screen.getByLabelText(/signups/i))
  if (signups) await u.type(screen.getByLabelText(/signups/i), signups)
  await u.click(screen.getByRole('button', { name: /add referral/i }))
}

const sources = () => screen.getByRole('region', { name: 'Sources view' })
const funnel = () => screen.getByRole('region', { name: 'Funnel view' })

describe('Referral program app', () => {
  it('starts on Referrals', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Referrals' })).toBeInTheDocument()
  })

  it('navigates to every view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Sources')
    expect(screen.getByRole('heading', { name: 'Sources' })).toBeInTheDocument()
    await nav(u, 'Funnel')
    expect(screen.getByRole('heading', { name: 'Funnel' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Referrals')
    expect(screen.getByRole('heading', { name: 'Referrals' })).toBeInTheDocument()
  })

  it('adds a referral rendered as a single summary line', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReferral(u, 'Ada', 'Partner', '40', '10')
    expect(screen.getByText('Ada — Partner: 40 invites, 10 signups')).toBeInTheDocument()
  })

  it('allows zero invites and zero signups', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReferral(u, 'Quiet', 'Organic', '0', '0')
    expect(screen.getByText('Quiet — Organic: 0 invites, 0 signups')).toBeInTheDocument()
  })

  it('ignores a referral with negative signups', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReferral(u, 'Bad', 'Paid', '10', '-2')
    await nav(u, 'Funnel')
    expect(within(funnel()).getByText(/total signups: 0/i)).toBeInTheDocument()
  })

  it('rolls invites and signups up per source (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReferral(u, 'A', 'Paid', '50', '5')
    await addReferral(u, 'B', 'Paid', '50', '15')
    await nav(u, 'Sources')
    expect(
      within(sources()).getByText('Paid: 100 invites, 20 signups, rate 20%'),
    ).toBeInTheDocument()
  })

  it('shows rate n/a for a source with no invites', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReferral(u, 'Lurker', 'Organic', '0', '0')
    await nav(u, 'Sources')
    expect(
      within(sources()).getByText('Organic: 0 invites, 0 signups, rate n/a'),
    ).toBeInTheDocument()
  })

  it('lists only sources that have records', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReferral(u, 'Only', 'Influencer', '20', '4')
    await nav(u, 'Sources')
    expect(within(sources()).getByText(/^Influencer:/)).toBeInTheDocument()
    expect(within(sources()).queryByText(/^Organic:/)).not.toBeInTheDocument()
    expect(within(sources()).queryByText(/^Paid:/)).not.toBeInTheDocument()
  })

  it('computes funnel totals, rate and bounty', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReferral(u, 'A', 'Organic', '60', '6')
    await addReferral(u, 'B', 'Paid', '40', '4')
    await nav(u, 'Funnel')
    expect(within(funnel()).getByText('Total invites: 100')).toBeInTheDocument()
    expect(within(funnel()).getByText('Total signups: 10')).toBeInTheDocument()
    expect(within(funnel()).getByText('Conversion rate: 10%')).toBeInTheDocument()
    expect(within(funnel()).getByText('Bounty owed: $200')).toBeInTheDocument()
  })

  it('shows Conversion rate n/a with no invites at all', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Funnel')
    expect(within(funnel()).getByText('Conversion rate: n/a')).toBeInTheDocument()
    expect(within(funnel()).getByText('Bounty owed: $0')).toBeInTheDocument()
  })

  it('toggles theme via data-theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Funnel')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('hides zero-signup records when Show converted only is checked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReferral(u, 'Closer', 'Paid', '10', '3')
    await addReferral(u, 'Dud', 'Organic', '10', '0')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show converted only/i))
    await nav(u, 'Referrals')
    expect(screen.getByText('Closer — Paid: 10 invites, 3 signups')).toBeInTheDocument()
    expect(screen.queryByText('Dud — Organic: 10 invites, 0 signups')).not.toBeInTheDocument()
  })

  it('keeps hidden records counted in the funnel', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReferral(u, 'Closer', 'Paid', '10', '3')
    await addReferral(u, 'Dud', 'Organic', '30', '0')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show converted only/i))
    await nav(u, 'Funnel')
    expect(within(funnel()).getByText('Total invites: 40')).toBeInTheDocument()
  })
})
