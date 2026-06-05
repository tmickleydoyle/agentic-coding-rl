import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('tags and settings', () => {
  it('lists tags with counts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-tags'))
    // intro on m1 + m3
    expect(screen.getByTestId('tag-intro-count')).toHaveTextContent('2')
    expect(screen.getByTestId('tag-docs-count')).toHaveTextContent('1')
  })

  it('filtering by a tag navigates to the list and narrows it', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-tags'))
    await user.click(screen.getByTestId('filter-docs'))
    expect(screen.getByTestId('page-list')).toBeInTheDocument()
    expect(screen.getByTestId('active-filter')).toHaveTextContent('docs')
    expect(screen.getByTestId('note-m3')).toBeInTheDocument()
    expect(screen.queryByTestId('note-m1')).not.toBeInTheDocument()
  })

  it('clears the filter back to all notes', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-tags'))
    await user.click(screen.getByTestId('filter-docs'))
    await user.click(screen.getByTestId('nav-tags'))
    await user.click(screen.getByTestId('clear-filter'))
    await user.click(screen.getByTestId('nav-list'))
    expect(screen.getByTestId('active-filter')).toHaveTextContent('none')
    expect(screen.getByTestId('note-m1')).toBeInTheDocument()
  })

  it('shows total words and toggles theme persistently', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    // 5 (m1) + 4 (m2) + 3 (m3) = 12
    expect(screen.getByTestId('total-words')).toHaveTextContent('12')
    await user.click(screen.getByTestId('theme-toggle'))
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
    await user.click(screen.getByTestId('nav-list'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
  })
})
