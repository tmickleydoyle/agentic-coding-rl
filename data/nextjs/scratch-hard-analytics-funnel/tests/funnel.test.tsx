import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addFunnel(u: U, name: string) {
  await u.clear(screen.getByLabelText(/funnel name/i))
  await u.type(screen.getByLabelText(/funnel name/i), name)
  await u.click(screen.getByRole('button', { name: /add funnel/i }))
}

async function addStep(u: U, funnel: string, name: string, users: string) {
  await u.selectOptions(screen.getByLabelText(/^funnel$/i), funnel)
  await u.clear(screen.getByLabelText(/step name/i))
  await u.type(screen.getByLabelText(/step name/i), name)
  await u.clear(screen.getByLabelText(/^users$/i))
  if (users) await u.type(screen.getByLabelText(/^users$/i), users)
  await u.click(screen.getByRole('button', { name: /add step/i }))
}

function analysis() {
  return screen.getByRole('region', { name: 'Analysis view' })
}
function group(name: string) {
  return screen.getByRole('group', { name })
}

describe('Funnel analytics app', () => {
  it('starts on Funnels', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Funnels' })).toBeInTheDocument()
  })

  it('navigates to every view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Steps')
    expect(screen.getByRole('heading', { name: 'Steps' })).toBeInTheDocument()
    await nav(u, 'Analysis')
    expect(screen.getByRole('heading', { name: 'Analysis' })).toBeInTheDocument()
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    await nav(u, 'Funnels')
    expect(screen.getByRole('heading', { name: 'Funnels' })).toBeInTheDocument()
  })

  it('adds a funnel showing zero steps', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFunnel(u, 'Signup')
    expect(screen.getByText('Signup (0 steps)')).toBeInTheDocument()
  })

  it('ignores a blank funnel name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/funnel name/i), '   ')
    await u.click(screen.getByRole('button', { name: /add funnel/i }))
    expect(screen.queryByText(/steps\)/i)).not.toBeInTheDocument()
  })

  it('adds a step and lists it', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFunnel(u, 'Signup')
    await nav(u, 'Steps')
    await addStep(u, 'Signup', 'Visit', '1000')
    expect(screen.getByText('Visit: 1000 users')).toBeInTheDocument()
  })

  it('counts steps back on the Funnels view (cross-view)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFunnel(u, 'Signup')
    await nav(u, 'Steps')
    await addStep(u, 'Signup', 'Visit', '1000')
    await addStep(u, 'Signup', 'Form', '400')
    await nav(u, 'Funnels')
    expect(screen.getByText('Signup (2 steps)')).toBeInTheDocument()
  })

  it('shows 0% drop-off for the first step', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFunnel(u, 'Signup')
    await nav(u, 'Steps')
    await addStep(u, 'Signup', 'Visit', '1000')
    await nav(u, 'Analysis')
    expect(within(group('Signup analysis')).getByText('Visit: 1000 users, 0% drop-off')).toBeInTheDocument()
  })

  it('computes drop-off relative to the previous step', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFunnel(u, 'Signup')
    await nav(u, 'Steps')
    await addStep(u, 'Signup', 'Visit', '1000')
    await addStep(u, 'Signup', 'Form', '400')
    await nav(u, 'Analysis')
    const g = within(group('Signup analysis'))
    expect(g.getByText('Visit: 1000 users, 0% drop-off')).toBeInTheDocument()
    expect(g.getByText('Form: 400 users, 60% drop-off')).toBeInTheDocument()
  })

  it('chains drop-off across three steps', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFunnel(u, 'Signup')
    await nav(u, 'Steps')
    await addStep(u, 'Signup', 'Visit', '1000')
    await addStep(u, 'Signup', 'Form', '400')
    await addStep(u, 'Signup', 'Done', '100')
    await nav(u, 'Analysis')
    const g = within(group('Signup analysis'))
    expect(g.getByText('Done: 100 users, 75% drop-off')).toBeInTheDocument()
  })

  it('computes overall conversion as last over first', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFunnel(u, 'Signup')
    await nav(u, 'Steps')
    await addStep(u, 'Signup', 'Visit', '1000')
    await addStep(u, 'Signup', 'Form', '400')
    await addStep(u, 'Signup', 'Done', '100')
    await nav(u, 'Analysis')
    expect(within(group('Signup analysis')).getByText('Signup overall conversion: 10%')).toBeInTheDocument()
  })

  it('treats a non-positive user count as zero', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFunnel(u, 'Signup')
    await nav(u, 'Steps')
    await addStep(u, 'Signup', 'Visit', '')
    expect(screen.getByText('Visit: 0 users')).toBeInTheDocument()
  })

  it('ignores a step when no funnel is selected', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Steps')
    await u.type(screen.getByLabelText(/step name/i), 'Orphan')
    await u.type(screen.getByLabelText(/^users$/i), '10')
    await u.click(screen.getByRole('button', { name: /add step/i }))
    expect(screen.queryByText(/Orphan:/)).not.toBeInTheDocument()
  })

  it('ignores a blank step name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFunnel(u, 'Signup')
    await nav(u, 'Steps')
    await u.selectOptions(screen.getByLabelText(/^funnel$/i), 'Signup')
    await u.type(screen.getByLabelText(/^users$/i), '10')
    await u.click(screen.getByRole('button', { name: /add step/i }))
    expect(screen.queryByText(/users$/)).not.toBeInTheDocument()
  })

  it('shows 0% overall conversion for a funnel with no steps', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFunnel(u, 'Empty')
    await nav(u, 'Analysis')
    expect(within(group('Empty analysis')).getByText('Empty overall conversion: 0%')).toBeInTheDocument()
  })

  it('toggles theme via data-theme and persists across views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Analysis')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('hides empty funnels in Analysis when the setting is on', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFunnel(u, 'Full')
    await addFunnel(u, 'Empty')
    await nav(u, 'Steps')
    await addStep(u, 'Full', 'Visit', '100')
    await nav(u, 'Settings')
    await u.click(screen.getByLabelText(/hide empty funnels/i))
    await nav(u, 'Analysis')
    expect(screen.getByRole('group', { name: 'Full analysis' })).toBeInTheDocument()
    expect(screen.queryByRole('group', { name: 'Empty analysis' })).not.toBeInTheDocument()
  })

  it('keeps empty funnels visible in Analysis by default', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFunnel(u, 'Empty')
    await nav(u, 'Analysis')
    expect(screen.getByRole('group', { name: 'Empty analysis' })).toBeInTheDocument()
  })

  it('scopes steps and analysis to the right funnel', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFunnel(u, 'A')
    await addFunnel(u, 'B')
    await nav(u, 'Steps')
    await addStep(u, 'A', 'A1', '100')
    await addStep(u, 'B', 'B1', '200')
    await nav(u, 'Analysis')
    expect(within(group('A analysis')).getByText('A1: 100 users, 0% drop-off')).toBeInTheDocument()
    expect(within(group('B analysis')).getByText('B1: 200 users, 0% drop-off')).toBeInTheDocument()
  })
})
