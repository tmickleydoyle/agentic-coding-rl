// HELD-OUT generalization tests — overlaid only at eval, never seen by the agent.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))
const sources = () => screen.getByRole('region', { name: 'Sources view' })
const funnel = () => screen.getByRole('region', { name: 'Funnel view' })

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

describe('Referral program (held-out)', () => {
  it('rounds the per-source rate to a whole percent', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReferral(u, 'A', 'Partner', '3', '1')
    await nav(u, 'Sources')
    // 1/3 = 33.33% -> 33%
    expect(
      within(sources()).getByText('Partner: 3 invites, 1 signups, rate 33%'),
    ).toBeInTheDocument()
  })

  it('keeps sources independent in the rollup', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReferral(u, 'S', 'Influencer', '25', '5')
    await addReferral(u, 'P', 'Partner', '10', '2')
    await nav(u, 'Sources')
    expect(
      within(sources()).getByText('Influencer: 25 invites, 5 signups, rate 20%'),
    ).toBeInTheDocument()
    expect(
      within(sources()).getByText('Partner: 10 invites, 2 signups, rate 20%'),
    ).toBeInTheDocument()
  })

  it('rounds the overall conversion rate', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReferral(u, 'A', 'Organic', '8', '3')
    await nav(u, 'Funnel')
    // 3/8 = 37.5% -> 38%
    expect(within(funnel()).getByText('Conversion rate: 38%')).toBeInTheDocument()
    expect(within(funnel()).getByText('Bounty owed: $60')).toBeInTheDocument()
  })

  it('counts invites with zero signups toward the rate denominator', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReferral(u, 'Win', 'Paid', '50', '10')
    await addReferral(u, 'Miss', 'Paid', '50', '0')
    await nav(u, 'Funnel')
    expect(within(funnel()).getByText('Conversion rate: 10%')).toBeInTheDocument()
  })

  it('unchecking Show converted only brings zero-signup records back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addReferral(u, 'Dud', 'Organic', '10', '0')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show converted only/i))
    await u.click(screen.getByLabelText(/show converted only/i))
    await nav(u, 'Referrals')
    expect(screen.getByText('Dud — Organic: 10 invites, 0 signups')).toBeInTheDocument()
  })
})
