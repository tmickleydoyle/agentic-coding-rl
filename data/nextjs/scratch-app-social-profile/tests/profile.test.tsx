import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('profile page', () => {
  it('shows my name and bio by default', () => {
    render(<App />)
    expect(screen.getByTestId('profile-name')).toHaveTextContent('Mia')
    expect(screen.getByTestId('profile-bio')).toHaveTextContent('Builder of things')
  })

  it('shows my stats from seed data', () => {
    render(<App />)
    // u1 authored p1 + p2 = 2 posts; followers = [u2,u4] = 2; following = [u2,u3] = 2
    expect(screen.getByTestId('stat-posts-value')).toHaveTextContent('2')
    expect(screen.getByTestId('stat-followers-value')).toHaveTextContent('2')
    expect(screen.getByTestId('stat-following-value')).toHaveTextContent('2')
  })

  it('does not show a follow toggle on my own profile', () => {
    render(<App />)
    expect(screen.queryByTestId('follow-toggle')).not.toBeInTheDocument()
  })

  it('shows a follow toggle when viewing another user', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-connections'))
    await user.click(screen.getByTestId('view-u4'))
    expect(screen.getByTestId('profile-name')).toHaveTextContent('Kai')
    // u4 not in following -> Follow
    expect(screen.getByTestId('follow-toggle')).toHaveTextContent('Follow')
  })

  it('shows another users post count but zero followers/following', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-connections'))
    await user.click(screen.getByTestId('view-u2'))
    // u2 authored p3 = 1 post
    expect(screen.getByTestId('stat-posts-value')).toHaveTextContent('1')
    expect(screen.getByTestId('stat-followers-value')).toHaveTextContent('0')
    expect(screen.getByTestId('stat-following-value')).toHaveTextContent('0')
  })

  it('toggles follow from the viewed profile', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-connections'))
    await user.click(screen.getByTestId('view-u4'))
    expect(screen.getByTestId('follow-toggle')).toHaveTextContent('Follow')
    await user.click(screen.getByTestId('follow-toggle'))
    expect(screen.getByTestId('follow-toggle')).toHaveTextContent('Following')
  })
})
