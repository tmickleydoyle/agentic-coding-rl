import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the today page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-today')).toBeInTheDocument()
    expect(screen.getByTestId('nav-today')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-entries')).not.toHaveAttribute('aria-current')
  })

  it('navigates to entries', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-entries'))
    expect(screen.getByTestId('page-entries')).toBeInTheDocument()
    expect(screen.getByTestId('nav-entries')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to insights', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-insights'))
    expect(screen.getByTestId('page-insights')).toBeInTheDocument()
  })

  it('the quick-new button on today goes to the new page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('quick-new'))
    expect(screen.getByTestId('page-new')).toBeInTheDocument()
  })

  it('defaults to light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})
