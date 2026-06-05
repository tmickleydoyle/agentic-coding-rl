import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('search', () => {
  it('shows the empty prompt before typing', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-search'))
    expect(screen.getByTestId('search-empty')).toBeInTheDocument()
    expect(screen.queryByTestId('search-results')).not.toBeInTheDocument()
  })

  it('finds notes by title across all notebooks', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-search'))
    await user.type(screen.getByTestId('search-input'), 'sprint')
    expect(screen.getByTestId('result-n2')).toBeInTheDocument()
    expect(screen.queryByTestId('result-n1')).not.toBeInTheDocument()
  })

  it('finds notes by body text', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-search'))
    await user.type(screen.getByTestId('search-input'), 'milk')
    expect(screen.getByTestId('result-n1')).toBeInTheDocument()
    expect(screen.queryByTestId('result-n2')).not.toBeInTheDocument()
  })
})
