import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addRequest(u: U, title: string, priority: 'low' | 'medium' | 'high' = 'low') {
  await u.clear(screen.getByLabelText(/title/i))
  await u.type(screen.getByLabelText(/title/i), title)
  await u.selectOptions(screen.getByLabelText(/priority/i), priority)
  await u.click(screen.getByRole('button', { name: /add request/i }))
}

function reqRow(title: string): HTMLElement {
  const li = screen.getByText(title).closest('li')
  if (!li) throw new Error(`no row for ${title}`)
  return li as HTMLElement
}

describe('Design Request Queue (held-out)', () => {
  it('filter counts update when a request changes status', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Poster design')
    await addRequest(u, 'Social assets')
    expect(screen.getByRole('button', { name: 'new (2)' })).toBeInTheDocument()
    await u.click(within(reqRow('Poster design')).getByRole('button', { name: /set poster design in-progress/i }))
    expect(screen.getByRole('button', { name: 'new (1)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'in-progress (1)' })).toBeInTheDocument()
  })

  it('in-progress filter shows only in-progress items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Card design')
    await addRequest(u, 'Form layout')
    await u.click(within(reqRow('Card design')).getByRole('button', { name: /set card design in-progress/i }))
    await u.click(screen.getByRole('button', { name: /^in-progress \(/ }))
    expect(screen.getByText('Showing: 1 requests')).toBeInTheDocument()
    expect(screen.getByText('Card design')).toBeInTheDocument()
    expect(screen.queryByText('Form layout')).not.toBeInTheDocument()
  })

  it('new filter shows only new items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'App icon')
    await addRequest(u, 'Splash screen')
    await u.click(within(reqRow('App icon')).getByRole('button', { name: /set app icon done/i }))
    await u.click(screen.getByRole('button', { name: /^new \(/ }))
    expect(screen.getByText('Showing: 1 requests')).toBeInTheDocument()
    expect(screen.getByText('Splash screen')).toBeInTheDocument()
    expect(screen.queryByText('App icon')).not.toBeInTheDocument()
  })

  it('multiple high priority requests counted correctly in Stats', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Urgent A', 'high')
    await addRequest(u, 'Urgent B', 'high')
    await addRequest(u, 'Low C', 'low')
    await nav(u, 'Stats')
    expect(screen.getByText('High Priority: 2')).toBeInTheDocument()
    expect(screen.getByText('Total: 3')).toBeInTheDocument()
  })

  it('completion rounds to whole number percent for thirds', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'One')
    await addRequest(u, 'Two')
    await addRequest(u, 'Three')
    await u.click(within(reqRow('One')).getByRole('button', { name: /set one done/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('Completion: 33%')).toBeInTheDocument()
  })

  it('Stats reflects status changes made in Queue view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Design system')
    await nav(u, 'Stats')
    expect(screen.getByText('New: 1')).toBeInTheDocument()
    expect(screen.getByText('In Progress: 0')).toBeInTheDocument()
    await nav(u, 'Queue')
    await u.click(within(reqRow('Design system')).getByRole('button', { name: /set design system in-progress/i }))
    await nav(u, 'Stats')
    expect(screen.getByText('New: 0')).toBeInTheDocument()
    expect(screen.getByText('In Progress: 1')).toBeInTheDocument()
  })

  it('adding multiple requests updates Showing count correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'P1')
    await addRequest(u, 'P2')
    await addRequest(u, 'P3')
    expect(screen.getByText('Showing: 3 requests')).toBeInTheDocument()
  })

  it('high priority request visible with correct priority label', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Critical rebrand', 'high')
    expect(within(reqRow('Critical rebrand')).getByText('high')).toBeInTheDocument()
  })

  it('medium priority request visible with correct priority label', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addRequest(u, 'Newsletter', 'medium')
    expect(within(reqRow('Newsletter')).getByText('medium')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })
})
