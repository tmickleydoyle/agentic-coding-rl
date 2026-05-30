import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the polls page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-polls')).toBeInTheDocument()
    expect(screen.getByTestId('nav-polls')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-trending')).not.toHaveAttribute('aria-current')
  })

  it('navigates to create', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-create'))
    expect(screen.getByTestId('page-create')).toBeInTheDocument()
    expect(screen.getByTestId('nav-create')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to trending', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-trending'))
    expect(screen.getByTestId('page-trending')).toBeInTheDocument()
  })

  it('navigates to the poll tab and back', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-poll'))
    expect(screen.getByTestId('page-poll')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-polls'))
    expect(screen.getByTestId('page-polls')).toBeInTheDocument()
    expect(screen.getByTestId('nav-poll')).not.toHaveAttribute('aria-current')
  })
})
