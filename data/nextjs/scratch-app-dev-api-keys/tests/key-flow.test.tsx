import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('key flow', () => {
  it('lists seeded keys with masked secrets', () => {
    render(<App />)
    const list = screen.getByTestId('key-list')
    expect(within(list).getByText('CI deploy')).toBeInTheDocument()
    expect(screen.getByTestId('key-k1-secret')).toHaveTextContent('sk_l...1111')
    expect(screen.getByTestId('key-k1-secret')).not.toHaveTextContent('aaaa')
  })

  it('marks active state on rows', () => {
    render(<App />)
    expect(screen.getByTestId('key-k1')).toHaveAttribute('data-active', 'true')
    expect(screen.getByTestId('key-k3')).toHaveAttribute('data-active', 'false')
  })

  it('opens a key detail with masked secret, scopes, usage and status', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-k1'))
    expect(screen.getByTestId('page-key-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-name')).toHaveTextContent('CI deploy')
    expect(screen.getByTestId('detail-secret')).toHaveTextContent('sk_l...1111')
    expect(screen.getByTestId('detail-usage')).toHaveTextContent('12')
    expect(screen.getByTestId('detail-status')).toHaveTextContent('active')
    const scopes = screen.getByTestId('detail-scopes')
    expect(within(scopes).getByTestId('scope-read')).toBeInTheDocument()
    expect(within(scopes).getByTestId('scope-write')).toBeInTheDocument()
  })

  it('revokes a key from the detail page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-k1'))
    expect(screen.getByTestId('detail-status')).toHaveTextContent('active')
    await user.click(screen.getByTestId('revoke-btn'))
    expect(screen.getByTestId('detail-status')).toHaveTextContent('revoked')
    expect(screen.queryByTestId('revoke-btn')).not.toBeInTheDocument()
  })

  it('records usage from the detail page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-k2'))
    expect(screen.getByTestId('detail-usage')).toHaveTextContent('4')
    await user.click(screen.getByTestId('use-btn'))
    expect(screen.getByTestId('detail-usage')).toHaveTextContent('5')
  })

  it('does not show a revoke button for an already-revoked key', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-k3'))
    expect(screen.getByTestId('detail-status')).toHaveTextContent('revoked')
    expect(screen.queryByTestId('revoke-btn')).not.toBeInTheDocument()
  })

  it('shows a no-selection message before opening', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-key-detail'))
    expect(screen.getByTestId('no-selection')).toBeInTheDocument()
  })
})
