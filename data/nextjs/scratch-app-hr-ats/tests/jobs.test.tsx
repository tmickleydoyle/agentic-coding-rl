import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('jobs list and detail', () => {
  it('lists seeded jobs with candidate counts', () => {
    render(<App />)
    expect(screen.getByTestId('job-j1-title')).toHaveTextContent('Frontend Engineer')
    expect(screen.getByTestId('job-j1-dept')).toHaveTextContent('Engineering')
    expect(screen.getByTestId('job-j1-count')).toHaveTextContent('3')
    expect(screen.getByTestId('job-j2-count')).toHaveTextContent('1')
    expect(screen.getByTestId('job-j3-count')).toHaveTextContent('0')
  })

  it('opens a job detail when clicking open', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-j1'))
    expect(screen.getByTestId('page-job-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-title')).toHaveTextContent('Frontend Engineer')
    expect(screen.getByTestId('nav-job-detail')).toHaveAttribute('aria-current', 'page')
  })

  it('detail page lists only that job candidates', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-j1'))
    const list = screen.getByTestId('detail-candidates')
    expect(within(list).getByTestId('detail-candidate-c1')).toBeInTheDocument()
    expect(within(list).getByTestId('detail-candidate-c2')).toBeInTheDocument()
    expect(within(list).queryByTestId('detail-candidate-c3')).not.toBeInTheDocument()
    expect(screen.getByTestId('detail-count')).toHaveTextContent('3')
  })

  it('detail candidates show their stage', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-j2'))
    expect(screen.getByTestId('detail-candidate-c3-name')).toHaveTextContent('Linus Torvalds')
    expect(screen.getByTestId('detail-candidate-c3-stage')).toHaveTextContent('offer')
    expect(screen.getByTestId('detail-candidate-c3')).toHaveAttribute('data-stage', 'offer')
  })
})
