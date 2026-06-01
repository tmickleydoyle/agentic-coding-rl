import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('speakers view', () => {
  it('lists each distinct speaker', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-speakers'))
    expect(screen.getByTestId('speaker-Ada')).toBeInTheDocument()
    expect(screen.getByTestId('speaker-Grace')).toBeInTheDocument()
    expect(screen.getByTestId('speaker-Linus')).toBeInTheDocument()
    expect(screen.getByTestId('speaker-Edsger')).toBeInTheDocument()
  })

  it('shows the session count per speaker', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-speakers'))
    expect(screen.getByTestId('speaker-Ada-count')).toHaveTextContent('1')
    expect(screen.getByTestId('speaker-Edsger-count')).toHaveTextContent('1')
  })
})
