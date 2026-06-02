import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addBlast(
  u: U,
  subject: string,
  list: string,
  sent: string,
  opens: string,
  clicks: string,
) {
  await u.clear(screen.getByLabelText(/subject/i))
  await u.type(screen.getByLabelText(/subject/i), subject)
  await u.selectOptions(screen.getByLabelText(/^list$/i), list)
  await u.clear(screen.getByLabelText(/sent/i))
  if (sent) await u.type(screen.getByLabelText(/sent/i), sent)
  await u.clear(screen.getByLabelText(/opens/i))
  if (opens) await u.type(screen.getByLabelText(/opens/i), opens)
  await u.clear(screen.getByLabelText(/clicks/i))
  if (clicks) await u.type(screen.getByLabelText(/clicks/i), clicks)
  await u.click(screen.getByRole('button', { name: /add blast/i }))
}

const lists = () => screen.getByRole('region', { name: 'Lists view' })
const overview = () => screen.getByRole('region', { name: 'Overview view' })

describe('Email engagement app', () => {
  it('starts on Blasts', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Blasts' })).toBeInTheDocument()
  })

  it('navigates to every view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Lists')
    expect(screen.getByRole('heading', { name: 'Lists' })).toBeInTheDocument()
    await nav(u, 'Overview')
    expect(screen.getByRole('heading', { name: 'Overview' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Blasts')
    expect(screen.getByRole('heading', { name: 'Blasts' })).toBeInTheDocument()
  })

  it('adds a blast rendered as a single summary line', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBlast(u, 'Spring News', 'Newsletter', '1000', '400', '80')
    expect(
      screen.getByText('Spring News — Newsletter: 1000 sent, 400 opens, 80 clicks'),
    ).toBeInTheDocument()
  })

  it('allows zero opens and zero clicks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBlast(u, 'Silent', 'Promotions', '500', '0', '0')
    expect(
      screen.getByText('Silent — Promotions: 500 sent, 0 opens, 0 clicks'),
    ).toBeInTheDocument()
  })

  it('ignores a blast with negative clicks', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBlast(u, 'Bad', 'Winback', '100', '50', '-1')
    await nav(u, 'Overview')
    expect(within(overview()).getByText(/total sent: 0/i)).toBeInTheDocument()
  })

  it('rolls per-list open rate and CTR up across blasts (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBlast(u, 'A', 'Newsletter', '600', '200', '40')
    await addBlast(u, 'B', 'Newsletter', '400', '200', '60')
    await nav(u, 'Lists')
    // open rate = 400/1000 = 40% ; CTR = 100/400 = 25%
    expect(within(lists()).getByText('Newsletter: open rate 40%, CTR 25%')).toBeInTheDocument()
  })

  it('shows open rate n/a and CTR n/a for a list with no sends', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBlast(u, 'Empty', 'Onboarding', '0', '0', '0')
    await nav(u, 'Lists')
    expect(
      within(lists()).getByText('Onboarding: open rate n/a, CTR n/a'),
    ).toBeInTheDocument()
  })

  it('lists only lists that have blasts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBlast(u, 'Only', 'Winback', '200', '50', '10')
    await nav(u, 'Lists')
    expect(within(lists()).getByText(/^Winback:/)).toBeInTheDocument()
    expect(within(lists()).queryByText(/^Newsletter:/)).not.toBeInTheDocument()
    expect(within(lists()).queryByText(/^Promotions:/)).not.toBeInTheDocument()
  })

  it('computes overview totals, open rate and CTR', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBlast(u, 'A', 'Newsletter', '800', '400', '100')
    await addBlast(u, 'B', 'Promotions', '200', '100', '50')
    await nav(u, 'Overview')
    expect(within(overview()).getByText('Total sent: 1000')).toBeInTheDocument()
    expect(within(overview()).getByText('Total opens: 500')).toBeInTheDocument()
    expect(within(overview()).getByText('Total clicks: 150')).toBeInTheDocument()
    expect(within(overview()).getByText('Open rate: 50%')).toBeInTheDocument()
    expect(within(overview()).getByText('Click-through rate: 30%')).toBeInTheDocument()
  })

  it('shows Open rate n/a and CTR n/a with no data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Overview')
    expect(within(overview()).getByText('Open rate: n/a')).toBeInTheDocument()
    expect(within(overview()).getByText('Click-through rate: n/a')).toBeInTheDocument()
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

  it('hides zero-open blasts when Show opened only is checked', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBlast(u, 'Engaged', 'Newsletter', '100', '40', '10')
    await addBlast(u, 'Ignored', 'Promotions', '100', '0', '0')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show opened only/i))
    await nav(u, 'Blasts')
    expect(
      screen.getByText('Engaged — Newsletter: 100 sent, 40 opens, 10 clicks'),
    ).toBeInTheDocument()
    expect(
      screen.queryByText('Ignored — Promotions: 100 sent, 0 opens, 0 clicks'),
    ).not.toBeInTheDocument()
  })

  it('keeps hidden blasts counted in the overview', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addBlast(u, 'Engaged', 'Newsletter', '100', '40', '10')
    await addBlast(u, 'Ignored', 'Promotions', '300', '0', '0')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/show opened only/i))
    await nav(u, 'Overview')
    expect(within(overview()).getByText('Total sent: 400')).toBeInTheDocument()
  })
})
