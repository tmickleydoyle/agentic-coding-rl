import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the pipelines page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-pipelines')).toBeInTheDocument()
    expect(screen.getByTestId('nav-pipelines')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-builds')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the builds page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-builds'))
    expect(screen.getByTestId('page-builds')).toBeInTheDocument()
    expect(screen.getByTestId('nav-builds')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-pipelines')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the stats page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-stats'))
    expect(screen.getByTestId('page-stats')).toBeInTheDocument()
    expect(screen.getByTestId('nav-stats')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to detail and back to pipelines', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-pipeline-detail'))
    expect(screen.getByTestId('page-pipeline-detail')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-pipelines'))
    expect(screen.getByTestId('page-pipelines')).toBeInTheDocument()
    expect(screen.getByTestId('nav-pipeline-detail')).not.toHaveAttribute('aria-current')
  })
})
