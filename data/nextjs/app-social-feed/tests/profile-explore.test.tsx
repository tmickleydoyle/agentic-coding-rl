import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('profile and explore', () => {
  it('defaults the profile page to the current user with no follow button', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-profile'))
    expect(screen.getByTestId('profile-name')).toHaveTextContent('You')
    expect(screen.queryByTestId('follow-toggle')).not.toBeInTheDocument()
  })

  it('shows the current user post count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-profile'))
    expect(screen.getByTestId('profile-post-count')).toHaveTextContent('1')
    expect(within(screen.getByTestId('profile-posts')).getByText('Coffee then code')).toBeInTheDocument()
  })

  it('visits another user from explore and can follow them', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-explore'))
    await user.click(screen.getByTestId('visit-u3'))
    expect(screen.getByTestId('profile-name')).toHaveTextContent('Linus')
    // u3 not followed initially
    expect(screen.getByTestId('follow-toggle')).toHaveTextContent('Follow')
    await user.click(screen.getByTestId('follow-toggle'))
    expect(screen.getByTestId('follow-toggle')).toHaveTextContent('Following')
  })

  it('reflects the seeded following state for Ada on her profile', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-explore'))
    await user.click(screen.getByTestId('visit-u2'))
    expect(screen.getByTestId('follow-toggle')).toHaveTextContent('Following')
  })

  it('lists other users on explore (not the current user)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-explore'))
    expect(screen.getByTestId('user-u2')).toBeInTheDocument()
    expect(screen.getByTestId('user-u3')).toBeInTheDocument()
    expect(screen.queryByTestId('user-u1')).not.toBeInTheDocument()
  })

  it('toggles follow from explore and updates the button label', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-explore'))
    expect(screen.getByTestId('follow-u2')).toHaveTextContent('Following')
    await user.click(screen.getByTestId('follow-u2'))
    expect(screen.getByTestId('follow-u2')).toHaveTextContent('Follow')
  })

  it('shows feed stats from the seed data', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-explore'))
    expect(screen.getByTestId('stat-posts')).toHaveTextContent('3')
    // seed likes: 3 + 1 + 0 = 4
    expect(screen.getByTestId('stat-likes')).toHaveTextContent('4')
    expect(screen.getByTestId('stat-following')).toHaveTextContent('1')
  })

  it('updates the following stat after following a new user', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-explore'))
    await user.click(screen.getByTestId('follow-u3'))
    expect(screen.getByTestId('stat-following')).toHaveTextContent('2')
  })
})
