import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('feed', () => {
  it('lists all clips with likes by default', () => {
    render(<App />)
    const list = screen.getByTestId('clip-list')
    expect(within(list).getByTestId('clip-c1-title')).toHaveTextContent('Quick Tip')
    expect(within(list).getByTestId('clip-c1-likes')).toHaveTextContent('10')
    expect(within(list).getByTestId('clip-c2-title')).toHaveTextContent('Funny Cat')
    expect(within(list).getAllByTestId(/^clip-c\d$/)).toHaveLength(5)
  })

  it('shows no save badges initially', () => {
    render(<App />)
    expect(screen.queryByTestId('save-badge-c1')).not.toBeInTheDocument()
  })

  it('opens a clip to its detail page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-c2'))
    expect(screen.getByTestId('page-clip-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-title')).toHaveTextContent('Funny Cat')
    expect(screen.getByTestId('detail-category')).toHaveTextContent('Fun')
    expect(screen.getByTestId('detail-likes')).toHaveTextContent('42')
  })

  it('the all-filter resets the category to all', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-categories'))
    await user.click(screen.getByTestId('cat-Fun-filter'))
    expect(screen.getByTestId('active-category')).toHaveTextContent('Fun')
    expect(screen.getAllByTestId(/^clip-c\d$/)).toHaveLength(2)
    await user.click(screen.getByTestId('all-filter'))
    expect(screen.getByTestId('active-category')).toHaveTextContent('All')
    expect(screen.getAllByTestId(/^clip-c\d$/)).toHaveLength(5)
  })
})
