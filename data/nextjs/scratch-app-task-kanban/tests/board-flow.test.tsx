import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('board flow', () => {
  it('places seeded cards in their columns', () => {
    render(<App />)
    expect(within(screen.getByTestId('column-backlog')).getByText('Set up repo')).toBeInTheDocument()
    expect(within(screen.getByTestId('column-doing')).getByText('Write tests')).toBeInTheDocument()
    expect(within(screen.getByTestId('column-doing')).getByText('Draft API')).toBeInTheDocument()
    expect(within(screen.getByTestId('column-done')).getByText('Ship v1')).toBeInTheDocument()
  })

  it('marks the column of a card via data-column', () => {
    render(<App />)
    expect(screen.getByTestId('card-c1')).toHaveAttribute('data-column', 'backlog')
    expect(screen.getByTestId('card-c4')).toHaveAttribute('data-column', 'done')
  })

  it('moves a card forward backlog -> doing', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('forward-c1'))
    expect(screen.getByTestId('card-c1')).toHaveAttribute('data-column', 'doing')
  })

  it('moves a card all the way to done and hides forward there', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('forward-c1')) // doing
    await user.click(screen.getByTestId('forward-c1')) // done
    expect(screen.getByTestId('card-c1')).toHaveAttribute('data-column', 'done')
    expect(screen.queryByTestId('forward-c1')).not.toBeInTheDocument()
  })

  it('moves a card back doing -> backlog', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('back-c2'))
    expect(screen.getByTestId('card-c2')).toHaveAttribute('data-column', 'backlog')
  })

  it('has no back button in backlog and no forward in done', () => {
    render(<App />)
    expect(screen.queryByTestId('back-c1')).not.toBeInTheDocument()
    expect(screen.queryByTestId('forward-c4')).not.toBeInTheDocument()
  })

  it('deletes a card', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('delete-c3'))
    expect(screen.queryByTestId('card-c3')).not.toBeInTheDocument()
  })

  it('adds a card via the form, landing in backlog', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add-card'))
    await user.type(screen.getByTestId('card-title-input'), 'Refactor store')
    await user.click(screen.getByTestId('submit-card'))
    expect(screen.getByTestId('page-board')).toBeInTheDocument()
    expect(within(screen.getByTestId('column-backlog')).getByText('Refactor store')).toBeInTheDocument()
  })

  it('blocks adding a card with an empty title', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add-card'))
    await user.click(screen.getByTestId('submit-card'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-add-card')).toBeInTheDocument()
  })
})
