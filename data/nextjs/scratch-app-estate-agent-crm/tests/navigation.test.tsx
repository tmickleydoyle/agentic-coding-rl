import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the leads page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-leads')).toBeInTheDocument()
    expect(screen.getByTestId('nav-leads')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-properties')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the properties page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-properties'))
    expect(screen.getByTestId('page-properties')).toBeInTheDocument()
    expect(screen.getByTestId('nav-properties')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to the pipeline page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-pipeline'))
    expect(screen.getByTestId('page-pipeline')).toBeInTheDocument()
    expect(screen.getByTestId('nav-pipeline')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to pipeline and back to leads', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-pipeline'))
    await user.click(screen.getByTestId('nav-leads'))
    expect(screen.getByTestId('page-leads')).toBeInTheDocument()
    expect(screen.getByTestId('nav-pipeline')).not.toHaveAttribute('aria-current')
  })
})
