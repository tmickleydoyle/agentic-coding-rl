import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('edit profile', () => {
  it('prefills the form with my current name and bio', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-edit'))
    expect(screen.getByTestId('name-input')).toHaveValue('Mia')
    expect(screen.getByTestId('bio-input')).toHaveValue('Builder of things')
  })

  it('saves an edited name and reflects it on the profile', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-edit'))
    const name = screen.getByTestId('name-input')
    await user.clear(name)
    await user.type(name, 'Mia R.')
    await user.click(screen.getByTestId('save-profile'))
    expect(screen.getByTestId('page-profile')).toBeInTheDocument()
    expect(screen.getByTestId('profile-name')).toHaveTextContent('Mia R.')
  })

  it('saves an edited bio', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-edit'))
    const bio = screen.getByTestId('bio-input')
    await user.clear(bio)
    await user.type(bio, 'New bio here')
    await user.click(screen.getByTestId('save-profile'))
    expect(screen.getByTestId('profile-bio')).toHaveTextContent('New bio here')
  })

  it('blocks saving an empty name and stays on the edit page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-edit'))
    await user.clear(screen.getByTestId('name-input'))
    await user.click(screen.getByTestId('save-profile'))
    expect(screen.getByTestId('edit-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-edit')).toBeInTheDocument()
  })

  it('trims the saved name', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-edit'))
    const name = screen.getByTestId('name-input')
    await user.clear(name)
    await user.type(name, '   Spacey   ')
    await user.click(screen.getByTestId('save-profile'))
    expect(screen.getByTestId('profile-name')).toHaveTextContent('Spacey')
  })
})
