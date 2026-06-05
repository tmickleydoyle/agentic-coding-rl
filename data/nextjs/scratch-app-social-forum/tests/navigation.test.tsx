import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the threads page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-threads')).toBeInTheDocument()
    expect(screen.getByTestId('nav-threads')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-categories')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the new thread page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-new'))
    expect(screen.getByTestId('page-new')).toBeInTheDocument()
    expect(screen.getByTestId('nav-new')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to categories', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-categories'))
    expect(screen.getByTestId('page-categories')).toBeInTheDocument()
    expect(screen.getByTestId('nav-threads')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the thread detail tab and back', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-thread'))
    expect(screen.getByTestId('page-thread')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-threads'))
    expect(screen.getByTestId('page-threads')).toBeInTheDocument()
  })
})
