import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('notebooks page', () => {
  it('lists the seeded notebooks with note counts', () => {
    render(<App />)
    const list = screen.getByTestId('notebook-list')
    expect(within(list).getByTestId('notebook-nb1-name')).toHaveTextContent('Personal')
    expect(within(list).getByTestId('notebook-nb2-name')).toHaveTextContent('Work')
    // Personal has n1 + n3, Work has n2
    expect(screen.getByTestId('notebook-nb1-count')).toHaveTextContent('2')
    expect(screen.getByTestId('notebook-nb2-count')).toHaveTextContent('1')
  })

  it('opening a notebook navigates to its notes', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-nb1'))
    expect(screen.getByTestId('page-notes')).toBeInTheDocument()
    expect(screen.getByTestId('note-list')).toBeInTheDocument()
    expect(screen.getByTestId('note-n1')).toBeInTheDocument()
    expect(screen.getByTestId('note-n3')).toBeInTheDocument()
    expect(screen.queryByTestId('note-n2')).not.toBeInTheDocument()
  })
})
