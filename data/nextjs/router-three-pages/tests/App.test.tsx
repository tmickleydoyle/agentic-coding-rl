import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../components/App'

describe('App router', () => {
  it('starts on Home', () => {
    render(<App />)
    expect(screen.getByTestId('page')).toHaveTextContent('Welcome')
    expect(screen.getByTestId('current')).toHaveTextContent('home')
    expect(screen.getByTestId('nav-home')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-about')).not.toHaveAttribute('aria-current')
  })

  it('navigates to About', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-about'))
    expect(screen.getByTestId('page')).toHaveTextContent('About us')
    expect(screen.getByTestId('current')).toHaveTextContent('about')
    expect(screen.getByTestId('nav-about')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-home')).not.toHaveAttribute('aria-current')
  })

  it('navigates to Contact and back to Home', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-contact'))
    expect(screen.getByTestId('page')).toHaveTextContent('Get in touch')
    expect(screen.getByTestId('current')).toHaveTextContent('contact')
    await user.click(screen.getByTestId('nav-home'))
    expect(screen.getByTestId('current')).toHaveTextContent('home')
    expect(screen.getByTestId('nav-contact')).not.toHaveAttribute('aria-current')
  })
})
