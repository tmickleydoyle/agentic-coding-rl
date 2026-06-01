import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('add-word + progress', () => {
  it('blocks submitting a word with empty fields', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add-word'))
    await user.click(screen.getByTestId('submit-word'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-add-word')).toBeInTheDocument()
  })

  it('adds a word and returns to lists where the count grows', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add-word'))
    await user.selectOptions(screen.getByTestId('list-select'), 'l2')
    await user.type(screen.getByTestId('term-input'), 'no')
    await user.type(screen.getByTestId('answer-input-new'), 'non')
    await user.click(screen.getByTestId('submit-word'))
    expect(screen.getByTestId('page-lists')).toBeInTheDocument()
    expect(screen.getByTestId('list-l2-count')).toHaveTextContent('2')
  })

  it('progress aggregates totals and mastered across lists', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-progress'))
    // l1: 3 words, 1 mastered; l2: 1 word, 0 mastered -> total 4, mastered 1
    expect(screen.getByTestId('total-words-value')).toHaveTextContent('4')
    expect(screen.getByTestId('mastered-words-value')).toHaveTextContent('1')
    // l1 percent = round(1/3*100) = 33
    expect(screen.getByTestId('prog-list-l1-percent')).toHaveTextContent('33')
    expect(screen.getByTestId('prog-list-l2-percent')).toHaveTextContent('0')
  })

  it('progress reflects a word reaching mastery during practice', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('practice-l2')) // oui mastery 2
    await user.type(screen.getByTestId('answer-input'), 'oui')
    await user.click(screen.getByTestId('check-answer')) // -> mastery 3
    await user.click(screen.getByTestId('nav-progress'))
    expect(screen.getByTestId('mastered-words-value')).toHaveTextContent('2')
    expect(screen.getByTestId('prog-list-l2-percent')).toHaveTextContent('100')
  })
})
