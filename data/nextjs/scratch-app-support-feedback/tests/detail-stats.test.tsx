import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('item detail', () => {
  it('shows no-selection when none picked', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-item-detail'))
    expect(screen.getByTestId('no-selection')).toBeInTheDocument()
  })

  it('opens an item and shows its details', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-f2'))
    expect(screen.getByTestId('page-item-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-author')).toHaveTextContent('Rae')
    expect(screen.getByTestId('detail-message')).toHaveTextContent('Export keeps failing')
    expect(screen.getByTestId('detail-status')).toHaveTextContent('new')
  })

  it('changes status and reflects it back on the inbox', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-f2'))
    await user.click(screen.getByTestId('set-status-resolved'))
    expect(screen.getByTestId('detail-status')).toHaveTextContent('resolved')
    expect(screen.getByTestId('set-status-resolved')).toHaveAttribute('aria-current', 'true')
    await user.click(screen.getByTestId('nav-inbox'))
    expect(screen.getByTestId('fb-f2')).toHaveAttribute('data-status', 'resolved')
  })
})

describe('categories', () => {
  it('shows category counts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-categories'))
    expect(screen.getByTestId('cat-UI-count')).toHaveTextContent('2')
    expect(screen.getByTestId('cat-Bug-count')).toHaveTextContent('1')
    expect(screen.getByTestId('cat-Feature-count')).toHaveTextContent('1')
  })

  it('opening a category filters the inbox', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-categories'))
    await user.click(screen.getByTestId('cat-UI-open'))
    expect(screen.getByTestId('page-inbox')).toBeInTheDocument()
    expect(screen.getByTestId('inbox-count')).toHaveTextContent('2')
  })
})

describe('stats', () => {
  it('shows sentiment counts from seed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-stats'))
    // 2 positive (f1,f4), 1 neutral (f3), 1 negative (f2)
    expect(screen.getByTestId('sentiment-positive')).toHaveTextContent('2')
    expect(screen.getByTestId('sentiment-neutral')).toHaveTextContent('1')
    expect(screen.getByTestId('sentiment-negative')).toHaveTextContent('1')
  })

  it('shows status counts from seed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-stats'))
    // 2 new (f1,f2), 1 reviewed (f3), 1 resolved (f4)
    expect(screen.getByTestId('status-new')).toHaveTextContent('2')
    expect(screen.getByTestId('status-reviewed')).toHaveTextContent('1')
    expect(screen.getByTestId('status-resolved')).toHaveTextContent('1')
    expect(screen.getByTestId('total-count')).toHaveTextContent('4')
  })

  it('updates status counts after changing an item status', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-f1'))
    await user.click(screen.getByTestId('set-status-resolved'))
    await user.click(screen.getByTestId('nav-stats'))
    expect(screen.getByTestId('status-new')).toHaveTextContent('1')
    expect(screen.getByTestId('status-resolved')).toHaveTextContent('2')
  })

  it('toggles theme and persists across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
    await user.click(screen.getByTestId('nav-stats'))
    await user.click(screen.getByTestId('theme-toggle'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
    await user.click(screen.getByTestId('nav-inbox'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
  })
})
