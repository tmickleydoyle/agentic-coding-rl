import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('add flow', () => {
  it('blocks adding a blank-named habit', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.click(screen.getByTestId('submit-habit'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-add')).toBeInTheDocument()
  })

  it('adds a habit and navigates to the habits page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('name-input'), 'Meditate')
    await user.click(screen.getByTestId('submit-habit'))
    expect(screen.getByTestId('page-habits')).toBeInTheDocument()
    expect(screen.getByTestId('manage-h4-name')).toHaveTextContent('Meditate')
  })

  it('a newly added habit starts not done with zero streak', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('name-input'), 'Meditate')
    await user.click(screen.getByTestId('submit-habit'))
    expect(screen.getByTestId('manage-h4-streak')).toHaveTextContent('0')
    await user.click(screen.getByTestId('nav-today'))
    expect(screen.getByTestId('habit-h4')).toHaveAttribute('data-done', 'false')
    expect(screen.getByTestId('today-total')).toHaveTextContent('4')
  })

  it('a newly added habit can be toggled done for today', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('name-input'), 'Meditate')
    await user.click(screen.getByTestId('submit-habit'))
    await user.click(screen.getByTestId('nav-today'))
    await user.click(screen.getByTestId('toggle-h4'))
    expect(screen.getByTestId('habit-h4')).toHaveAttribute('data-done', 'true')
  })

  it('assigns sequential ids to added habits', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('name-input'), 'One')
    await user.click(screen.getByTestId('submit-habit'))
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('name-input'), 'Two')
    await user.click(screen.getByTestId('submit-habit'))
    expect(screen.getByTestId('manage-h4-name')).toHaveTextContent('One')
    expect(screen.getByTestId('manage-h5-name')).toHaveTextContent('Two')
  })
})
