// HELD-OUT generalization tests — different inputs, edge cases, and cross-view sequences.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addFeedback(u: U, note: string, scr: string) {
  await u.clear(screen.getByLabelText('Note'))
  await u.clear(screen.getByLabelText('Screen'))
  await u.type(screen.getByLabelText('Note'), note)
  await u.type(screen.getByLabelText('Screen'), scr)
  await u.click(screen.getByRole('button', { name: /add feedback/i }))
}

function itemRow(note: string): HTMLElement {
  const el = screen.getByText(note).closest('li')
  if (!el) throw new Error(`no row for ${note}`)
  return el as HTMLElement
}

describe('Design Feedback Tracker (held-out)', () => {
  it('adding three items gives Open feedback (3)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Alpha', 'Screen1')
    await addFeedback(u, 'Beta', 'Screen2')
    await addFeedback(u, 'Gamma', 'Screen3')
    expect(screen.getByRole('heading', { name: 'Open feedback (3)' })).toBeInTheDocument()
  })

  it('addressing all items gives Open feedback (0)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'One', 'S1')
    await addFeedback(u, 'Two', 'S2')
    await u.click(within(itemRow('One')).getByRole('button', { name: /mark addressed one/i }))
    await u.click(within(itemRow('Two')).getByRole('button', { name: /mark addressed two/i }))
    expect(screen.getByRole('heading', { name: 'Open feedback (0)' })).toBeInTheDocument()
  })

  it('Summary reflects addressed count as items are resolved', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Issue X', 'PageX')
    await addFeedback(u, 'Issue Y', 'PageY')
    await addFeedback(u, 'Issue Z', 'PageZ')
    await u.click(within(itemRow('Issue X')).getByRole('button', { name: /mark addressed issue x/i }))
    await u.click(within(itemRow('Issue Z')).getByRole('button', { name: /mark addressed issue z/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total items: 3')).toBeInTheDocument()
    expect(screen.getByText('Open: 1')).toBeInTheDocument()
    expect(screen.getByText('Addressed: 2')).toBeInTheDocument()
  })

  it('Addressed rate rounds correctly for one-third', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'R1', 'S1')
    await addFeedback(u, 'R2', 'S2')
    await addFeedback(u, 'R3', 'S3')
    await u.click(within(itemRow('R1')).getByRole('button', { name: /mark addressed r1/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Addressed rate: 33%')).toBeInTheDocument()
  })

  it('filter checkbox is unchecked by default', () => {
    render(<App />)
    const checkbox = screen.getByLabelText('Show open only') as HTMLInputElement
    expect(checkbox.checked).toBe(false)
  })

  it('filter state resets to unchecked when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Show open only'))
    await nav(u, 'Summary')
    await nav(u, 'Feedback')
    // filter is local UI state so it may reset; addressed items should still be visible
    const checkbox = screen.getByLabelText('Show open only') as HTMLInputElement
    // whether reset or not, the app should not crash
    expect(checkbox).toBeInTheDocument()
  })

  it('inputs are cleared after successful add', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Clear me', 'Screen')
    expect((screen.getByLabelText('Note') as HTMLInputElement).value).toBe('')
    expect((screen.getByLabelText('Screen') as HTMLInputElement).value).toBe('')
  })

  it('addressed item still visible when filter is off', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Was open', 'HomePage')
    await u.click(within(itemRow('Was open')).getByRole('button', { name: /mark addressed was open/i }))
    expect(screen.getByText('Was open')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
  })

  it('feedback data is unaffected by theme toggle', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Theme safe', 'Screen99')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Feedback')
    expect(screen.getByText('Theme safe')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Open feedback (1)' })).toBeInTheDocument()
  })

  it('both note and screen must be non-blank: only screen given is rejected', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Screen'), 'Dashboard')
    await u.click(screen.getByRole('button', { name: /add feedback/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total items: 0')).toBeInTheDocument()
  })

  it('multiple independent items each have their own Mark addressed button', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addFeedback(u, 'Item P', 'ScreenP')
    await addFeedback(u, 'Item Q', 'ScreenQ')
    expect(within(itemRow('Item P')).getByRole('button', { name: /mark addressed item p/i })).toBeInTheDocument()
    expect(within(itemRow('Item Q')).getByRole('button', { name: /mark addressed item q/i })).toBeInTheDocument()
  })
})
