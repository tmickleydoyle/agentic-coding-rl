import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('create poll', () => {
  it('creates a poll and opens its detail', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-create'))
    await user.type(screen.getByTestId('question-input'), 'Cats or dogs?')
    await user.type(screen.getByTestId('option-input-0'), 'Cats')
    await user.type(screen.getByTestId('option-input-1'), 'Dogs')
    await user.click(screen.getByTestId('submit-poll'))
    expect(screen.getByTestId('page-poll')).toBeInTheDocument()
    expect(screen.getByTestId('detail-question')).toHaveTextContent('Cats or dogs?')
    expect(screen.getByTestId('option-q4-o1-label')).toHaveTextContent('Cats')
    expect(screen.getByTestId('option-q4-o2-label')).toHaveTextContent('Dogs')
  })

  it('blocks creating with a blank question', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-create'))
    await user.type(screen.getByTestId('option-input-0'), 'A')
    await user.type(screen.getByTestId('option-input-1'), 'B')
    await user.click(screen.getByTestId('submit-poll'))
    expect(screen.getByTestId('create-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-create')).toBeInTheDocument()
  })

  it('blocks creating with fewer than two options', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-create'))
    await user.type(screen.getByTestId('question-input'), 'Only one?')
    await user.type(screen.getByTestId('option-input-0'), 'Solo')
    await user.click(screen.getByTestId('submit-poll'))
    expect(screen.getByTestId('create-error')).toBeInTheDocument()
  })

  it('ignores blank option inputs when counting options', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-create'))
    await user.type(screen.getByTestId('question-input'), 'Two real options')
    await user.type(screen.getByTestId('option-input-0'), 'Yes')
    await user.type(screen.getByTestId('option-input-2'), 'No')
    // option-input-1 left blank
    await user.click(screen.getByTestId('submit-poll'))
    expect(screen.getByTestId('page-poll')).toBeInTheDocument()
    expect(screen.getByTestId('option-q4-o1-label')).toHaveTextContent('Yes')
    expect(screen.getByTestId('option-q4-o2-label')).toHaveTextContent('No')
  })

  it('a created poll then appears in the polls list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-create'))
    await user.type(screen.getByTestId('question-input'), 'New in list')
    await user.type(screen.getByTestId('option-input-0'), 'X')
    await user.type(screen.getByTestId('option-input-1'), 'Y')
    await user.click(screen.getByTestId('submit-poll'))
    await user.click(screen.getByTestId('nav-polls'))
    expect(screen.getByTestId('poll-q4-question')).toHaveTextContent('New in list')
    expect(screen.getByTestId('poll-q4-total')).toHaveTextContent('0')
  })
})
