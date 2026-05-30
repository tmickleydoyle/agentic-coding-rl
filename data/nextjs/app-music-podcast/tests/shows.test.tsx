import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('shows list', () => {
  it('lists the seeded shows', () => {
    render(<App />)
    const list = screen.getByTestId('show-list')
    expect(within(list).getByTestId('show-sh1-title')).toHaveTextContent('Tech Talk')
    expect(within(list).getByTestId('show-sh2-category')).toHaveTextContent('news')
  })

  it('shows the correct subscribe label by state', () => {
    render(<App />)
    expect(screen.getByTestId('subscribe-sh1')).toHaveTextContent('Unsubscribe')
    expect(screen.getByTestId('subscribe-sh2')).toHaveTextContent('Subscribe')
  })

  it('filters by category', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('category-filter'), 'news')
    expect(screen.getByTestId('show-sh2')).toBeInTheDocument()
    expect(screen.queryByTestId('show-sh1')).not.toBeInTheDocument()
    expect(screen.queryByTestId('show-sh3')).not.toBeInTheDocument()
  })

  it('subscribing from the list adds it to subscriptions', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('subscribe-sh2'))
    await user.click(screen.getByTestId('nav-subscriptions'))
    expect(screen.getByTestId('sub-sh2')).toBeInTheDocument()
  })

  it('opening a show navigates to detail', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-sh3'))
    expect(screen.getByTestId('page-show-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-title')).toHaveTextContent('Code Cast')
  })
})
