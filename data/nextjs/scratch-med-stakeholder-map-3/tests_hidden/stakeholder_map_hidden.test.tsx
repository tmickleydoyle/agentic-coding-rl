import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addStakeholder(u: U, name: string, influence: 'high' | 'med' | 'low' = 'high') {
  await u.clear(screen.getByLabelText('Name'))
  await u.type(screen.getByLabelText('Name'), name)
  await u.selectOptions(screen.getByLabelText('Influence'), influence)
  await u.click(screen.getByRole('button', { name: /add stakeholder/i }))
}

function row(name: string): HTMLElement {
  const el = screen.getByText(name).closest('li')
  if (!el) throw new Error(`no row for ${name}`)
  return el as HTMLElement
}

describe('Stakeholder Map (held-out)', () => {
  it('adds multiple stakeholders and heading count is correct', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Zara', 'high')
    await addStakeholder(u, 'Milo', 'med')
    await addStakeholder(u, 'Finn', 'low')
    await addStakeholder(u, 'Iris', 'high')
    expect(screen.getByRole('heading', { name: /stakeholders \(4\)/i })).toBeInTheDocument()
  })

  it('filter by Low shows only low-influence stakeholders', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Zara', 'high')
    await addStakeholder(u, 'Milo', 'low')
    await addStakeholder(u, 'Finn', 'low')
    await u.click(screen.getByRole('button', { name: 'Low' }))
    expect(screen.getByRole('heading', { name: /stakeholders \(2\)/i })).toBeInTheDocument()
    expect(screen.queryByText('Zara')).not.toBeInTheDocument()
    expect(screen.getByText('Milo')).toBeInTheDocument()
    expect(screen.getByText('Finn')).toBeInTheDocument()
  })

  it('removing a stakeholder updates summary total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Ada', 'high')
    await addStakeholder(u, 'Leo', 'med')
    await u.click(screen.getByRole('button', { name: /remove ada/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total: 1')).toBeInTheDocument()
    expect(screen.getByText('High influence: 0')).toBeInTheDocument()
    expect(screen.getByText('Med influence: 1')).toBeInTheDocument()
  })

  it('support rate rounds correctly for one of three', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Ada', 'high')
    await addStakeholder(u, 'Leo', 'med')
    await addStakeholder(u, 'Kai', 'low')
    await u.click(within(row('Ada')).getByRole('button', { name: /toggle supportive for ada/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Support rate: 33%')).toBeInTheDocument()
  })

  it('supportive toggle state persists after navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Nora', 'med')
    await u.click(within(row('Nora')).getByRole('button', { name: /toggle supportive for nora/i }))
    await nav(u, 'Summary')
    await nav(u, 'Stakeholders')
    expect(within(row('Nora')).getByRole('button', { name: /toggle supportive for nora/i })).toHaveTextContent('Supportive: Yes')
  })

  it('Low filter aria-pressed is true when active', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Low' }))
    expect(screen.getByRole('button', { name: 'Low' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Med' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('filter resets heading count to all after switching back to All', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'X', 'high')
    await addStakeholder(u, 'Y', 'med')
    await addStakeholder(u, 'Z', 'low')
    await u.click(screen.getByRole('button', { name: 'Med' }))
    expect(screen.getByRole('heading', { name: /stakeholders \(1\)/i })).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getByRole('heading', { name: /stakeholders \(3\)/i })).toBeInTheDocument()
  })

  it('theme toggles back to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })

  it('Summary supportive count decreases when toggled off', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addStakeholder(u, 'Raj', 'high')
    await u.click(within(row('Raj')).getByRole('button', { name: /toggle supportive for raj/i }))
    await u.click(within(row('Raj')).getByRole('button', { name: /toggle supportive for raj/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Supportive: 0')).toBeInTheDocument()
    expect(screen.getByText('Support rate: 0%')).toBeInTheDocument()
  })
})
