import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function goToCampaigns(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByTestId('nav-campaigns'))
}

describe('campaign flow', () => {
  it('lists seeded campaigns', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToCampaigns(user)
    const list = screen.getByTestId('campaign-list')
    expect(within(list).getByText('Welcome')).toBeInTheDocument()
    expect(within(list).getByText('Weekly Digest')).toBeInTheDocument()
  })

  it('shows the open rate for a sent campaign', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToCampaigns(user)
    // m1: 2 opens / 4 recipients = 50%
    expect(screen.getByTestId('campaign-m1-rate')).toHaveTextContent('50%')
    // m2 draft: 0%
    expect(screen.getByTestId('campaign-m2-rate')).toHaveTextContent('0%')
  })

  it('blocks composing a campaign with an empty subject', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-compose'))
    await user.click(screen.getByTestId('submit-campaign'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-compose')).toBeInTheDocument()
  })

  it('composes a campaign and it appears as a draft', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-compose'))
    await user.type(screen.getByTestId('subject-input'), 'Launch Day')
    await user.click(screen.getByTestId('submit-campaign'))
    expect(screen.getByTestId('page-campaigns')).toBeInTheDocument()
    const row = within(screen.getByTestId('campaign-list')).getByText('Launch Day').closest('li')
    expect(row).toHaveAttribute('data-status', 'draft')
  })

  it('sends a draft campaign and computes its open rate', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToCampaigns(user)
    expect(screen.getByTestId('campaign-m2')).toHaveAttribute('data-status', 'draft')
    await user.click(screen.getByTestId('send-m2'))
    expect(screen.getByTestId('campaign-m2')).toHaveAttribute('data-status', 'sent')
    // 2 active subscribers, mock opens = round(2*0.5)=1 => 50%
    expect(screen.getByTestId('campaign-m2-rate')).toHaveTextContent('50%')
  })

  it('hides the send button once a campaign is sent', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToCampaigns(user)
    expect(screen.queryByTestId('send-m1')).not.toBeInTheDocument() // already sent
    await user.click(screen.getByTestId('send-m2'))
    expect(screen.queryByTestId('send-m2')).not.toBeInTheDocument()
  })

  it('deletes a campaign', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToCampaigns(user)
    await user.click(screen.getByTestId('remove-m1'))
    expect(screen.queryByTestId('campaign-m1')).not.toBeInTheDocument()
  })

  it('filters campaigns by status', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToCampaigns(user)
    await user.selectOptions(screen.getByTestId('status-filter'), 'sent')
    expect(screen.getByTestId('campaign-m1')).toBeInTheDocument()
    expect(screen.queryByTestId('campaign-m2')).not.toBeInTheDocument()
    await user.selectOptions(screen.getByTestId('status-filter'), 'draft')
    expect(screen.getByTestId('campaign-m2')).toBeInTheDocument()
    expect(screen.queryByTestId('campaign-m1')).not.toBeInTheDocument()
  })
})

describe('subscriber flow', () => {
  it('lists seeded subscribers with active state', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-subscribers'))
    expect(screen.getByTestId('subscriber-s1')).toHaveAttribute('data-active', 'true')
    expect(screen.getByTestId('subscriber-s3')).toHaveAttribute('data-active', 'false')
  })

  it('blocks adding a subscriber with an empty email', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-subscribers'))
    await user.click(screen.getByTestId('submit-subscriber'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
  })

  it('adds a subscriber', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-subscribers'))
    await user.type(screen.getByTestId('email-input'), 'new@example.com')
    await user.click(screen.getByTestId('submit-subscriber'))
    expect(within(screen.getByTestId('subscriber-list')).getByText('new@example.com')).toBeInTheDocument()
  })

  it('toggles a subscriber active state', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-subscribers'))
    await user.click(screen.getByTestId('toggle-s1'))
    expect(screen.getByTestId('subscriber-s1')).toHaveAttribute('data-active', 'false')
  })
})
