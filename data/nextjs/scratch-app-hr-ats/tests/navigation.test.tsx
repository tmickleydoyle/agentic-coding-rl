import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the jobs page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-jobs')).toBeInTheDocument()
    expect(screen.getByTestId('nav-jobs')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-candidates')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the candidates page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-candidates'))
    expect(screen.getByTestId('page-candidates')).toBeInTheDocument()
    expect(screen.getByTestId('nav-candidates')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-jobs')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the pipeline page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-pipeline'))
    expect(screen.getByTestId('page-pipeline')).toBeInTheDocument()
    expect(screen.getByTestId('nav-pipeline')).toHaveAttribute('aria-current', 'page')
  })

  it('shows a no-job message on the detail page before selecting', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-job-detail'))
    expect(screen.getByTestId('page-job-detail')).toBeInTheDocument()
    expect(screen.getByTestId('no-job')).toBeInTheDocument()
  })

  it('keeps theme on the root element across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
    await user.click(screen.getByTestId('nav-pipeline'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})
