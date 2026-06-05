import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function openC1(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByTestId('open-c1'))
}

describe('like + save flow', () => {
  it('liking a clip bumps likes and shows the flag', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openC1(user)
    expect(screen.getByTestId('detail-likes')).toHaveTextContent('10')
    expect(screen.queryByTestId('liked-flag')).not.toBeInTheDocument()
    await user.click(screen.getByTestId('like-toggle'))
    expect(screen.getByTestId('detail-likes')).toHaveTextContent('11')
    expect(screen.getByTestId('liked-flag')).toBeInTheDocument()
    expect(screen.getByTestId('like-toggle')).toHaveTextContent('Unlike')
  })

  it('unliking reverts likes and hides the flag', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openC1(user)
    await user.click(screen.getByTestId('like-toggle'))
    await user.click(screen.getByTestId('like-toggle'))
    expect(screen.getByTestId('detail-likes')).toHaveTextContent('10')
    expect(screen.queryByTestId('liked-flag')).not.toBeInTheDocument()
  })

  it('like reflects on the feed likes count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openC1(user)
    await user.click(screen.getByTestId('like-toggle'))
    await user.click(screen.getByTestId('nav-feed'))
    expect(screen.getByTestId('clip-c1-likes')).toHaveTextContent('11')
  })

  it('saving a clip shows the save badge on the feed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openC1(user)
    expect(screen.getByTestId('save-toggle')).toHaveTextContent('Save')
    await user.click(screen.getByTestId('save-toggle'))
    expect(screen.getByTestId('save-toggle')).toHaveTextContent('Unsave')
    await user.click(screen.getByTestId('nav-feed'))
    expect(screen.getByTestId('save-badge-c1')).toBeInTheDocument()
  })

  it('saved clips appear newest-first on the saved page and can be removed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openC1(user)
    await user.click(screen.getByTestId('save-toggle')) // save c1
    await user.click(screen.getByTestId('nav-feed'))
    await user.click(screen.getByTestId('open-c3'))
    await user.click(screen.getByTestId('save-toggle')) // save c3
    await user.click(screen.getByTestId('nav-saved'))
    expect(screen.getByTestId('saved-count-value')).toHaveTextContent('2')
    const items = screen.getAllByTestId(/^sv-c\d$/)
    expect(items[0].getAttribute('data-testid')).toBe('sv-c3')
    expect(items[1].getAttribute('data-testid')).toBe('sv-c1')
    await user.click(screen.getByTestId('sv-remove-c3'))
    expect(screen.getByTestId('saved-count-value')).toHaveTextContent('1')
  })

  it('shows no-saved when nothing is saved', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-saved'))
    expect(screen.getByTestId('no-saved')).toBeInTheDocument()
  })
})
