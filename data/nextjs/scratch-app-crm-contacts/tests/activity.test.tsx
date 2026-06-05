import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('companies and activity feed', () => {
  it('lists companies with their contact counts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-companies'))
    expect(screen.getByTestId('company-co1-name')).toHaveTextContent('Acme')
    expect(screen.getByTestId('company-co1-count')).toHaveTextContent('2')
    expect(screen.getByTestId('company-co2-count')).toHaveTextContent('1')
  })

  it('shows the global activity total and feed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-activity'))
    expect(screen.getByTestId('activity-total')).toHaveTextContent('3')
    const feed = screen.getByTestId('activity-feed')
    expect(within(feed).getByTestId('feed-a1-contact')).toHaveTextContent('Ada Byron')
    expect(within(feed).getByTestId('feed-a3-contact')).toHaveTextContent('Grace Hopper')
  })

  it('logs a new activity and it appears in the feed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-activity'))
    await user.selectOptions(screen.getByTestId('activity-contact'), 'c3')
    await user.selectOptions(screen.getByTestId('activity-kind'), 'email')
    await user.type(screen.getByTestId('activity-text'), 'Followed up')
    await user.click(screen.getByTestId('activity-submit'))
    expect(screen.getByTestId('activity-total')).toHaveTextContent('4')
    expect(screen.getByTestId('feed-a4-text')).toHaveTextContent('Followed up')
    expect(screen.getByTestId('feed-a4')).toHaveAttribute('data-kind', 'email')
    expect(screen.getByTestId('feed-a4-contact')).toHaveTextContent('Linus T')
  })

  it('rejects an empty activity text', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-activity'))
    await user.click(screen.getByTestId('activity-submit'))
    expect(screen.getByTestId('activity-error')).toBeInTheDocument()
    expect(screen.getByTestId('activity-total')).toHaveTextContent('3')
  })

  it('a logged activity shows up in the contact detail log', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-activity'))
    await user.selectOptions(screen.getByTestId('activity-contact'), 'c3')
    await user.type(screen.getByTestId('activity-text'), 'New note')
    await user.click(screen.getByTestId('activity-submit'))
    await user.click(screen.getByTestId('nav-contacts'))
    await user.click(screen.getByTestId('open-c3'))
    expect(screen.getByTestId('activity-a4-text')).toHaveTextContent('New note')
  })
})
