import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders list by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-list')).toBeInTheDocument()
    expect(screen.getByTestId('nav-list')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-visited')).not.toHaveAttribute('aria-current')
  })

  it('navigates to visited', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-visited'))
    expect(screen.getByTestId('page-visited')).toBeInTheDocument()
    expect(screen.getByTestId('nav-visited')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to add', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    expect(screen.getByTestId('page-add')).toBeInTheDocument()
  })

  it('navigates to destination-detail and back to list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-destination-detail'))
    expect(screen.getByTestId('page-destination-detail')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-list'))
    expect(screen.getByTestId('page-list')).toBeInTheDocument()
    expect(screen.getByTestId('nav-destination-detail')).not.toHaveAttribute('aria-current')
  })
})
