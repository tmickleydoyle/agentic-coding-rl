import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../components/App'

describe('Login dashboard flow', () => {
  it('shows login fields initially; no error, no dashboard', () => {
    render(<App />)
    expect(screen.getByTestId('username')).toBeInTheDocument()
    expect(screen.queryByTestId('error')).toBeNull()
    expect(screen.queryByTestId('welcome')).toBeNull()
  })

  it('empty username on submit shows error', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('login'))
    expect(screen.getByTestId('error')).toHaveTextContent('Username required')
    expect(screen.queryByTestId('welcome')).toBeNull()
  })

  it('successful login lands on dashboard', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByTestId('username'), 'ada')
    await user.click(screen.getByTestId('login'))
    expect(screen.getByTestId('welcome')).toHaveTextContent('Welcome, ada!')
    expect(screen.queryByTestId('username')).toBeNull()
    expect(screen.queryByTestId('login')).toBeNull()
    expect(screen.getByTestId('logout')).toBeInTheDocument()
  })

  it('logout returns to login with empty fields and no error', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByTestId('username'), 'ada')
    await user.type(screen.getByTestId('password'), 'pw')
    await user.click(screen.getByTestId('login'))
    await user.click(screen.getByTestId('logout'))
    expect(screen.getByTestId('username')).toBeInTheDocument()
    expect((screen.getByTestId('username') as HTMLInputElement).value).toBe('')
    expect((screen.getByTestId('password') as HTMLInputElement).value).toBe('')
    expect(screen.queryByTestId('error')).toBeNull()
  })
})
