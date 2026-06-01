import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

const next = () => screen.getByRole('button', { name: /next/i })
const prev = () => screen.getByRole('button', { name: /previous/i })

async function answerAll(u: U, choices: string[]) {
  for (let i = 0; i < choices.length; i++) {
    await u.click(screen.getByRole('radio', { name: choices[i] }))
    if (i < choices.length - 1) await u.click(next())
  }
  await u.click(screen.getByRole('button', { name: /submit/i }))
}

describe('Quiz app', () => {
  it('shows the first question and progress', () => {
    render(<App />)
    expect(screen.getByText(/question 1 of 3/i)).toBeInTheDocument()
    expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument()
  })

  it('selects an option', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('radio', { name: '4' }))
    expect(screen.getByRole('radio', { name: '4' })).toBeChecked()
  })

  it('disables Previous on the first question', () => {
    render(<App />)
    expect(prev()).toBeDisabled()
  })

  it('navigates between questions', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(next())
    expect(screen.getByText(/question 2 of 3/i)).toBeInTheDocument()
    expect(screen.getByText('Capital of France?')).toBeInTheDocument()
    expect(prev()).toBeEnabled()
  })

  it('disables Next on the last question', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(next())
    await u.click(next())
    expect(screen.getByText(/question 3 of 3/i)).toBeInTheDocument()
    expect(next()).toBeDisabled()
  })

  it('remembers an answer when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('radio', { name: '4' }))
    await u.click(next())
    await u.click(prev())
    expect(screen.getByRole('radio', { name: '4' })).toBeChecked()
  })

  it('lets the user change an answer', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('radio', { name: '3' }))
    await u.click(screen.getByRole('radio', { name: '4' }))
    expect(screen.getByRole('radio', { name: '4' })).toBeChecked()
    expect(screen.getByRole('radio', { name: '3' })).not.toBeChecked()
  })

  it('scores a perfect quiz as 100% and Passed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await answerAll(u, ['4', 'Paris', 'Jupiter'])
    expect(screen.getByText(/you scored 3 of 3 \(100%\)/i)).toBeInTheDocument()
    expect(screen.getByText(/passed/i)).toBeInTheDocument()
  })

  it('scores 2 of 3 as 67% and Failed (below 70%)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await answerAll(u, ['4', 'Paris', 'Mars'])
    expect(screen.getByText(/you scored 2 of 3 \(67%\)/i)).toBeInTheDocument()
    expect(screen.getByText(/failed/i)).toBeInTheDocument()
  })

  it('shows a per-question review', async () => {
    const u = userEvent.setup()
    render(<App />)
    await answerAll(u, ['4', 'London', 'Jupiter'])
    expect(screen.getByText(/question 1: correct/i)).toBeInTheDocument()
    expect(screen.getByText(/question 2: incorrect/i)).toBeInTheDocument()
    expect(screen.getByText(/question 3: correct/i)).toBeInTheDocument()
  })

  it('restarts back to the first question, unsubmitted', async () => {
    const u = userEvent.setup()
    render(<App />)
    await answerAll(u, ['4', 'Paris', 'Jupiter'])
    await u.click(screen.getByRole('button', { name: /restart/i }))
    expect(screen.getByText(/question 1 of 3/i)).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: '4' })).not.toBeChecked()
  })
})
