import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Pros and Cons', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the page heading', () => {
    expect(screen.getByRole('heading', { name: /pros.*cons/i })).toBeInTheDocument()
  })

  it('shows first topic by default', () => {
    expect(screen.getByTestId('topic-title')).toHaveTextContent('Remote Work')
  })

  it('shows seed pros for first topic', () => {
    const pros = screen.getAllByTestId('pro-item')
    expect(pros).toHaveLength(2)
    expect(pros[0]).toHaveTextContent('Flexible schedule')
    expect(pros[1]).toHaveTextContent('No commute')
  })

  it('shows seed cons for first topic', () => {
    const cons = screen.getAllByTestId('con-item')
    expect(cons).toHaveLength(2)
    expect(cons[0]).toHaveTextContent('Isolation')
  })

  it('shows counts for first topic', () => {
    expect(screen.getByTestId('pro-count')).toHaveTextContent('2')
    expect(screen.getByTestId('con-count')).toHaveTextContent('2')
  })

  it('shows score 0 when equal', () => {
    expect(screen.getByTestId('score')).toHaveTextContent('0')
  })

  it('switches topic on select', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/select topic/i), 'Office Work')
    expect(screen.getByTestId('topic-title')).toHaveTextContent('Office Work')
    const pros = screen.getAllByTestId('pro-item')
    expect(pros[0]).toHaveTextContent('Team collaboration')
  })

  it('adds a pro to active topic', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/new pro/i), 'Great focus')
    await user.click(screen.getByRole('button', { name: /add pro/i }))
    const pros = screen.getAllByTestId('pro-item')
    expect(pros).toHaveLength(3)
    expect(screen.getByText('Great focus')).toBeInTheDocument()
  })

  it('updates score after adding a pro', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/new pro/i), 'Great focus')
    await user.click(screen.getByRole('button', { name: /add pro/i }))
    expect(screen.getByTestId('score')).toHaveTextContent('+1')
  })

  it('adds a con to active topic', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/new con/i), 'Hard to focus')
    await user.click(screen.getByRole('button', { name: /add con/i }))
    expect(screen.getAllByTestId('con-item')).toHaveLength(3)
  })

  it('removes a pro', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /remove pro: flexible schedule/i }))
    expect(screen.getAllByTestId('pro-item')).toHaveLength(1)
    expect(screen.queryByText('Flexible schedule')).not.toBeInTheDocument()
  })

  it('removes a con', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /remove con: isolation/i }))
    expect(screen.getAllByTestId('con-item')).toHaveLength(1)
  })

  it('adds a new topic and switches to it', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/new topic/i), 'Freelancing')
    await user.click(screen.getByRole('button', { name: /add topic/i }))
    expect(screen.getByTestId('topic-title')).toHaveTextContent('Freelancing')
    expect(screen.getByTestId('pro-count')).toHaveTextContent('0')
    expect(screen.getByTestId('con-count')).toHaveTextContent('0')
  })

  it('does not add pro with empty input', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /add pro/i }))
    expect(screen.getAllByTestId('pro-item')).toHaveLength(2)
  })
})
