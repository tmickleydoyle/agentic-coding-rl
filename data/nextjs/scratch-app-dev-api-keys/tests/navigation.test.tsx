import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the keys page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-keys')).toBeInTheDocument()
    expect(screen.getByTestId('nav-keys')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-usage')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the create page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-create-key'))
    expect(screen.getByTestId('page-create-key')).toBeInTheDocument()
    expect(screen.getByTestId('nav-create-key')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-keys')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the usage page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-usage'))
    expect(screen.getByTestId('page-usage')).toBeInTheDocument()
    expect(screen.getByTestId('nav-usage')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to detail and back to keys', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-key-detail'))
    expect(screen.getByTestId('page-key-detail')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-keys'))
    expect(screen.getByTestId('page-keys')).toBeInTheDocument()
    expect(screen.getByTestId('nav-key-detail')).not.toHaveAttribute('aria-current')
  })
})
