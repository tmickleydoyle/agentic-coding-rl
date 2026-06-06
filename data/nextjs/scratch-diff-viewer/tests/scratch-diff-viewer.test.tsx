import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../reference/app/page'

describe('Diff Viewer', () => {
  it('renders the page title', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /diff viewer/i })).toBeInTheDocument()
  })

  it('shows both textarea inputs', () => {
    render(<App />)
    expect(screen.getByLabelText(/original text/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/modified text/i)).toBeInTheDocument()
  })

  it('auto-computes diff on mount with seed data', () => {
    render(<App />)
    const rows = screen.getAllByTestId('diff-row')
    expect(rows.length).toBeGreaterThan(0)
  })

  it('shows added rows in seed diff', () => {
    render(<App />)
    const added = screen.getAllByTestId('diff-added')
    expect(added.length).toBeGreaterThan(0)
  })

  it('shows removed rows in seed diff', () => {
    render(<App />)
    const removed = screen.getAllByTestId('diff-removed')
    expect(removed.length).toBeGreaterThan(0)
  })

  it('shows same rows in seed diff', () => {
    render(<App />)
    const same = screen.getAllByTestId('diff-same')
    expect(same.length).toBeGreaterThan(0)
  })

  it('shows diff summary after mount', () => {
    render(<App />)
    const summary = screen.getByTestId('diff-summary')
    expect(summary.textContent).toMatch(/added/)
    expect(summary.textContent).toMatch(/removed/)
    expect(summary.textContent).toMatch(/unchanged/)
  })

  it('seed diff summary shows 1 added, 1 removed, 3 unchanged', () => {
    render(<App />)
    const summary = screen.getByTestId('diff-summary')
    expect(summary.textContent).toContain('1 added')
    expect(summary.textContent).toContain('1 removed')
    expect(summary.textContent).toContain('3 unchanged')
  })

  it('shows diff-empty when both inputs are empty and Compare is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)
    const orig = screen.getByLabelText(/original text/i)
    const mod = screen.getByLabelText(/modified text/i)
    await user.clear(orig)
    await user.clear(mod)
    await user.click(screen.getByRole('button', { name: /compare/i }))
    expect(screen.getByTestId('diff-empty')).toBeInTheDocument()
  })

  it('recomputes diff on Compare click with new inputs', async () => {
    const user = userEvent.setup()
    render(<App />)
    const orig = screen.getByLabelText(/original text/i)
    const mod = screen.getByLabelText(/modified text/i)
    await user.clear(orig)
    await user.clear(mod)
    await user.type(orig, 'line one\nline two')
    await user.type(mod, 'line one\nline three')
    await user.click(screen.getByRole('button', { name: /compare/i }))
    const summary = screen.getByTestId('diff-summary')
    expect(summary.textContent).toContain('1 added')
    expect(summary.textContent).toContain('1 removed')
    expect(summary.textContent).toContain('1 unchanged')
  })

  it('identical texts result in all same rows', async () => {
    const user = userEvent.setup()
    render(<App />)
    const orig = screen.getByLabelText(/original text/i)
    const mod = screen.getByLabelText(/modified text/i)
    await user.clear(orig)
    await user.clear(mod)
    await user.type(orig, 'hello\nworld')
    await user.type(mod, 'hello\nworld')
    await user.click(screen.getByRole('button', { name: /compare/i }))
    const summary = screen.getByTestId('diff-summary')
    expect(summary.textContent).toContain('0 added')
    expect(summary.textContent).toContain('0 removed')
    expect(summary.textContent).toContain('2 unchanged')
  })

  it('editing textarea does not auto-recompute diff', async () => {
    const user = userEvent.setup()
    render(<App />)
    const summarBefore = screen.getByTestId('diff-summary').textContent
    const orig = screen.getByLabelText(/original text/i)
    await user.clear(orig)
    await user.type(orig, 'completely different')
    // Without clicking Compare, summary should remain the same
    expect(screen.getByTestId('diff-summary').textContent).toBe(summarBefore)
  })

  it('shows Compare button', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /compare/i })).toBeInTheDocument()
  })
})
