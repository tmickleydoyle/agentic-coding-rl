import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('create key flow', () => {
  it('blocks submitting a key with an empty name', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-create-key'))
    await user.click(screen.getByTestId('submit-key'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-create-key')).toBeInTheDocument()
  })

  it('creates a key and navigates to the keys list where it appears', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-create-key'))
    await user.type(screen.getByTestId('name-input'), 'Mobile app')
    await user.click(screen.getByTestId('submit-key'))
    expect(screen.getByTestId('page-keys')).toBeInTheDocument()
    expect(within(screen.getByTestId('key-list')).getByText('Mobile app')).toBeInTheDocument()
  })

  it('a newly created key is active and starts with zero usage', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-create-key'))
    await user.type(screen.getByTestId('name-input'), 'Webhook')
    await user.click(screen.getByTestId('submit-key'))
    // new key id is k4
    expect(screen.getByTestId('key-k4')).toHaveAttribute('data-active', 'true')
    await user.click(screen.getByTestId('view-k4'))
    expect(screen.getByTestId('detail-usage')).toHaveTextContent('0')
  })

  it('honors the chosen scopes', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-create-key'))
    await user.type(screen.getByTestId('name-input'), 'Admin tool')
    await user.click(screen.getByTestId('scope-admin'))
    await user.click(screen.getByTestId('submit-key'))
    await user.click(screen.getByTestId('view-k4'))
    const scopes = screen.getByTestId('detail-scopes')
    expect(within(scopes).getByTestId('scope-read')).toBeInTheDocument()
    expect(within(scopes).getByTestId('scope-admin')).toBeInTheDocument()
  })
})
