import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('home summary', () => {
  it('shows project and post totals from seed', () => {
    render(<App />)
    expect(screen.getByTestId('project-total')).toHaveTextContent('3')
    expect(screen.getByTestId('post-total')).toHaveTextContent('3')
  })

  it('lists only featured projects', () => {
    render(<App />)
    const list = screen.getByTestId('featured-list')
    expect(within(list).getByText('Portfolio site')).toBeInTheDocument()
    expect(screen.getByTestId('featured-j1')).toBeInTheDocument()
    expect(screen.queryByTestId('featured-j2')).not.toBeInTheDocument()
  })

  it('reflects a newly featured project on the home list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-projects'))
    await user.click(screen.getByTestId('feature-j2'))
    await user.click(screen.getByTestId('nav-home'))
    expect(screen.getByTestId('featured-j2')).toBeInTheDocument()
  })

  it('drops an unfeatured project from the home list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-projects'))
    await user.click(screen.getByTestId('feature-j1'))
    await user.click(screen.getByTestId('nav-home'))
    expect(screen.queryByTestId('featured-j1')).not.toBeInTheDocument()
  })
})
