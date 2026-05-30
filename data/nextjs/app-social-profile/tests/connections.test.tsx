import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('connections page', () => {
  it('lists every profile except me', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-connections'))
    expect(screen.getByTestId('conn-u2')).toBeInTheDocument()
    expect(screen.getByTestId('conn-u3')).toBeInTheDocument()
    expect(screen.getByTestId('conn-u4')).toBeInTheDocument()
    expect(screen.queryByTestId('conn-u1')).not.toBeInTheDocument()
  })

  it('shows seeded following/followers counts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-connections'))
    expect(screen.getByTestId('following-count')).toHaveTextContent('2')
    expect(screen.getByTestId('followers-count')).toHaveTextContent('2')
  })

  it('reflects seeded follow state on the buttons', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-connections'))
    // following = [u2, u3]
    expect(screen.getByTestId('follow-u2')).toHaveTextContent('Following')
    expect(screen.getByTestId('follow-u3')).toHaveTextContent('Following')
    expect(screen.getByTestId('follow-u4')).toHaveTextContent('Follow')
  })

  it('following a new user updates the count and button', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-connections'))
    await user.click(screen.getByTestId('follow-u4'))
    expect(screen.getByTestId('follow-u4')).toHaveTextContent('Following')
    expect(screen.getByTestId('following-count')).toHaveTextContent('3')
  })

  it('unfollowing a user updates the count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-connections'))
    await user.click(screen.getByTestId('follow-u2'))
    expect(screen.getByTestId('follow-u2')).toHaveTextContent('Follow')
    expect(screen.getByTestId('following-count')).toHaveTextContent('1')
  })

  it('views a connection and lands on their profile', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-connections'))
    await user.click(screen.getByTestId('view-u3'))
    expect(screen.getByTestId('page-profile')).toBeInTheDocument()
    expect(screen.getByTestId('profile-name')).toHaveTextContent('Zoe')
  })
})
