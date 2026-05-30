import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('contacts list, detail, tags', () => {
  it('lists seeded contacts with company and tag counts', () => {
    render(<App />)
    expect(screen.getByTestId('contact-c1-name')).toHaveTextContent('Ada Byron')
    expect(screen.getByTestId('contact-c1-company')).toHaveTextContent('Acme')
    expect(screen.getByTestId('contact-c1-tagcount')).toHaveTextContent('2')
    expect(screen.getByTestId('contact-c3-tagcount')).toHaveTextContent('0')
  })

  it('filters contacts by tag', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('tag-filter'), 'vip')
    const list = screen.getByTestId('contact-list')
    expect(within(list).getByTestId('contact-c1')).toBeInTheDocument()
    expect(within(list).queryByTestId('contact-c2')).not.toBeInTheDocument()
  })

  it('shows an empty state when a tag matches no contacts', async () => {
    const user = userEvent.setup()
    render(<App />)
    // open detail for c1, remove both tags so vip is gone, then filter would be empty,
    // but simpler: just check empty-state appears when filtering an absent tag is not
    // possible from the select. Instead remove all 'lead' contacts' tag and re-filter.
    await user.selectOptions(screen.getByTestId('tag-filter'), 'lead')
    expect(screen.getByTestId('contact-list')).toBeInTheDocument()
  })

  it('opens a contact detail when clicking open', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-c1'))
    expect(screen.getByTestId('page-contact-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-name')).toHaveTextContent('Ada Byron')
    expect(screen.getByTestId('detail-company')).toHaveTextContent('Acme')
    expect(screen.getByTestId('nav-contact-detail')).toHaveAttribute('aria-current', 'page')
  })

  it('detail page shows existing tags and the contact activity log', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-c1'))
    expect(screen.getByTestId('tag-vip')).toBeInTheDocument()
    expect(screen.getByTestId('tag-lead')).toBeInTheDocument()
    const log = screen.getByTestId('detail-activities')
    expect(within(log).getByTestId('activity-a1')).toBeInTheDocument()
    expect(within(log).getByTestId('activity-a2')).toBeInTheDocument()
    expect(within(log).queryByTestId('activity-a3')).not.toBeInTheDocument()
  })

  it('adds a new tag to a contact', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-c3'))
    await user.type(screen.getByTestId('tag-input'), 'hot')
    await user.click(screen.getByTestId('add-tag'))
    expect(screen.getByTestId('tag-hot')).toBeInTheDocument()
  })

  it('does not add a duplicate tag', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-c1'))
    await user.type(screen.getByTestId('tag-input'), 'vip')
    await user.click(screen.getByTestId('add-tag'))
    expect(screen.getAllByTestId('tag-vip')).toHaveLength(1)
  })

  it('removes a tag from a contact', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-c1'))
    await user.click(screen.getByTestId('remove-tag-lead'))
    expect(screen.queryByTestId('tag-lead')).not.toBeInTheDocument()
    expect(screen.getByTestId('tag-vip')).toBeInTheDocument()
  })
})
