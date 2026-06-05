import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('entries flow', () => {
  it('lists entries newest-first', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-entries'))
    const rows = screen.getAllByTestId(/^entry-e\d+$/)
    // dates: e1 2026-05-27, e2 & e3 2026-05-28 => 28s first (e2 before e3, stable), then e1
    expect(rows[0]).toHaveAttribute('data-testid', 'entry-e2')
    expect(rows[1]).toHaveAttribute('data-testid', 'entry-e3')
    expect(rows[2]).toHaveAttribute('data-testid', 'entry-e1')
  })

  it('filters entries by mood', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-entries'))
    await user.selectOptions(screen.getByTestId('mood-filter'), 'sad')
    expect(screen.getByTestId('entry-e3')).toBeInTheDocument()
    expect(screen.queryByTestId('entry-e1')).not.toBeInTheDocument()
  })

  it('shows an empty state when a mood filter matches nothing', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-entries'))
    await user.selectOptions(screen.getByTestId('mood-filter'), 'happy')
    await user.click(screen.getByTestId('delete-e1')) // only happy entry gone
    expect(screen.getByTestId('entries-empty')).toBeInTheDocument()
    expect(screen.queryByTestId('entry-list')).not.toBeInTheDocument()
  })

  it('cycles an entry mood happy -> neutral', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-entries'))
    expect(screen.getByTestId('entry-e1')).toHaveAttribute('data-mood', 'happy')
    await user.click(screen.getByTestId('mood-e1'))
    expect(screen.getByTestId('entry-e1')).toHaveAttribute('data-mood', 'neutral')
  })

  it('cycles sad back to happy', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-entries'))
    expect(screen.getByTestId('entry-e3')).toHaveAttribute('data-mood', 'sad')
    await user.click(screen.getByTestId('mood-e3'))
    expect(screen.getByTestId('entry-e3')).toHaveAttribute('data-mood', 'happy')
  })

  it('deletes an entry', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-entries'))
    await user.click(screen.getByTestId('delete-e2'))
    expect(screen.queryByTestId('entry-e2')).not.toBeInTheDocument()
  })

  it('blocks saving an entry with an empty body', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-new'))
    await user.click(screen.getByTestId('save-entry'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-new')).toBeInTheDocument()
  })

  it('adds an entry with a chosen mood and lists it', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-new'))
    await user.type(screen.getByTestId('body-input'), 'Rough patch')
    await user.selectOptions(screen.getByTestId('mood-select'), 'sad')
    await user.click(screen.getByTestId('save-entry'))
    expect(screen.getByTestId('page-entries')).toBeInTheDocument()
    expect(screen.getByTestId('entry-e4')).toHaveAttribute('data-mood', 'sad')
  })
})
