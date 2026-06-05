import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('register and feedback flows', () => {
  it('blocks registering a visitor with an empty name', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-h3'))
    await user.click(screen.getByTestId('nav-register'))
    await user.click(screen.getByTestId('submit-visitor'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-register')).toBeInTheDocument()
  })

  it('registers a visitor and lands on the house detail with updated count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-h3'))
    await user.click(screen.getByTestId('nav-register'))
    await user.type(screen.getByTestId('name-input'), 'Nora')
    await user.click(screen.getByTestId('submit-visitor'))
    expect(screen.getByTestId('page-house-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-count')).toHaveTextContent('1')
    expect(within(screen.getByTestId('visitor-list')).getByText('Nora')).toBeInTheDocument()
  })

  it('updates the schedule total after registering a visitor', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-h3'))
    await user.click(screen.getByTestId('nav-register'))
    await user.type(screen.getByTestId('name-input'), 'Nora')
    await user.click(screen.getByTestId('submit-visitor'))
    await user.click(screen.getByTestId('nav-schedule'))
    expect(screen.getByTestId('total-visitors')).toHaveTextContent('4')
    expect(screen.getByTestId('house-h3-count')).toHaveTextContent('1')
  })

  it('blocks feedback with an empty visitor name', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-h2'))
    await user.click(screen.getByTestId('nav-feedback'))
    await user.click(screen.getByTestId('submit-feedback'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-feedback')).toBeInTheDocument()
  })

  it('adds feedback and shows it on the detail with a recomputed average', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-h2'))
    await user.click(screen.getByTestId('nav-feedback'))
    await user.type(screen.getByTestId('visitor-input'), 'Sam')
    await user.type(screen.getByTestId('rating-input'), '4')
    await user.type(screen.getByTestId('note-input'), 'Spacious')
    await user.click(screen.getByTestId('submit-feedback'))
    expect(screen.getByTestId('page-house-detail')).toBeInTheDocument()
    expect(screen.getByTestId('feedback-0-visitor')).toHaveTextContent('Sam')
    expect(screen.getByTestId('feedback-0-rating')).toHaveTextContent('4')
    expect(screen.getByTestId('detail-avg')).toHaveTextContent('4')
  })

  it('averages multiple feedback ratings to one decimal', async () => {
    const user = userEvent.setup()
    render(<App />)
    // h1 already has one rating of 5; add a 2 => average 3.5
    await user.click(screen.getByTestId('open-h1'))
    await user.click(screen.getByTestId('nav-feedback'))
    await user.type(screen.getByTestId('visitor-input'), 'Lee')
    await user.type(screen.getByTestId('rating-input'), '2')
    await user.click(screen.getByTestId('submit-feedback'))
    expect(screen.getByTestId('detail-avg')).toHaveTextContent('3.5')
  })
})
