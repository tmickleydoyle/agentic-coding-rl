import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addLead(u: U, company: string, value: string, stage: string) {
  await u.clear(screen.getByLabelText('Company'))
  await u.type(screen.getByLabelText('Company'), company)
  await u.clear(screen.getByLabelText('Deal Value'))
  await u.type(screen.getByLabelText('Deal Value'), value)
  await u.selectOptions(screen.getByLabelText('Stage'), stage)
  await u.click(screen.getByRole('button', { name: /add lead/i }))
}

describe('Lead Pipeline app', () => {
  it('starts on the Leads view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Leads' })).toBeInTheDocument()
  })

  it('seeds three leads on load', () => {
    render(<App />)
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
    expect(screen.getByText('Initech')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /showing 3 leads/i })).toBeInTheDocument()
  })

  it('shows seeded deal values formatted as dollars', () => {
    render(<App />)
    expect(screen.getByText('$5000')).toBeInTheDocument()
    expect(screen.getByText('$12000')).toBeInTheDocument()
    expect(screen.getByText('$8000')).toBeInTheDocument()
  })

  it('navigates to Summary view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByRole('heading', { name: 'Summary' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('adds a new lead and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Umbrella Ltd', '20000', 'demo')
    expect(screen.getByText('Umbrella Ltd')).toBeInTheDocument()
    expect(screen.getByText('$20000')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /showing 4 leads/i })).toBeInTheDocument()
  })

  it('ignores a lead with blank company', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Deal Value'))
    await u.type(screen.getByLabelText('Deal Value'), '1000')
    await u.click(screen.getByRole('button', { name: /add lead/i }))
    expect(screen.getByRole('heading', { name: /showing 3 leads/i })).toBeInTheDocument()
  })

  it('ignores a lead with zero deal value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Company'), 'Ghost Inc')
    await u.clear(screen.getByLabelText('Deal Value'))
    await u.type(screen.getByLabelText('Deal Value'), '0')
    await u.click(screen.getByRole('button', { name: /add lead/i }))
    expect(screen.getByRole('heading', { name: /showing 3 leads/i })).toBeInTheDocument()
  })

  it('deletes a lead', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete acme corp/i }))
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /showing 2 leads/i })).toBeInTheDocument()
  })

  it('filters leads by stage new', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'new')
    expect(screen.getByRole('heading', { name: /showing 1 leads/i })).toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.queryByText('Globex')).not.toBeInTheDocument()
  })

  it('filters leads by stage demo', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'demo')
    expect(screen.getByRole('heading', { name: /showing 1 leads/i })).toBeInTheDocument()
    expect(screen.getByText('Globex')).toBeInTheDocument()
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
  })

  it('filters leads by stage won', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'won')
    expect(screen.getByRole('heading', { name: /showing 1 leads/i })).toBeInTheDocument()
    expect(screen.getByText('Initech')).toBeInTheDocument()
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument()
  })

  it('All filter shows all leads', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'new')
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'All')
    expect(screen.getByRole('heading', { name: /showing 3 leads/i })).toBeInTheDocument()
  })

  it('filter persists when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.selectOptions(screen.getByLabelText('Filter by stage'), 'won')
    await nav(u, 'Summary')
    await nav(u, 'Leads')
    expect(screen.getByRole('heading', { name: /showing 1 leads/i })).toBeInTheDocument()
  })

  it('Summary shows seeded totals', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText(/total leads: 3/i)).toBeInTheDocument()
    expect(screen.getByText(/pipeline total: \$25000/i)).toBeInTheDocument()
    expect(screen.getByText(/won total: \$8000/i)).toBeInTheDocument()
  })

  it('Summary shows seeded stage counts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText(/^New: 1$/i)).toBeInTheDocument()
    expect(screen.getByText(/^Demo: 1$/i)).toBeInTheDocument()
    expect(screen.getByText(/^Won: 1$/i)).toBeInTheDocument()
  })

  it('Summary win rate is 33% with one won of three', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText(/win rate: 33%/i)).toBeInTheDocument()
  })

  it('Summary reflects a newly added lead (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addLead(u, 'Soylent', '7000', 'won')
    await nav(u, 'Summary')
    expect(screen.getByText(/total leads: 4/i)).toBeInTheDocument()
    expect(screen.getByText(/pipeline total: \$32000/i)).toBeInTheDocument()
    expect(screen.getByText(/won total: \$15000/i)).toBeInTheDocument()
  })

  it('Summary win rate is 0% when no leads', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete acme corp/i }))
    await u.click(screen.getByRole('button', { name: /delete globex/i }))
    await u.click(screen.getByRole('button', { name: /delete initech/i }))
    await nav(u, 'Summary')
    expect(screen.getByText(/win rate: 0%/i)).toBeInTheDocument()
    expect(screen.getByText(/pipeline total: \$0/i)).toBeInTheDocument()
  })

  it('toggles the theme via data-theme', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists across navigation', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Leads')
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('deleting a won lead updates Summary won total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /delete initech/i }))
    await nav(u, 'Summary')
    expect(screen.getByText(/won total: \$0/i)).toBeInTheDocument()
    expect(screen.getByText(/total leads: 2/i)).toBeInTheDocument()
  })
})
