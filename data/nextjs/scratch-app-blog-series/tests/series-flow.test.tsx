import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('series flow', () => {
  it('lists both seeded series with part counts', () => {
    render(<App />)
    const list = screen.getByTestId('series-list')
    expect(within(list).getByText('Learning Rust')).toBeInTheDocument()
    expect(within(list).getByText('Async Patterns')).toBeInTheDocument()
    expect(screen.getByTestId('part-count-s1')).toHaveTextContent('3')
    expect(screen.getByTestId('part-count-s2')).toHaveTextContent('3')
  })

  it('shows the read percent on each series card', () => {
    render(<App />)
    // s1: 2 of 3 read => 67%
    expect(screen.getByTestId('progress-s1')).toHaveTextContent('67%')
    // s2: 1 of 3 read => 33%
    expect(screen.getByTestId('progress-s2')).toHaveTextContent('33%')
  })

  it('opens a series detail and shows its parts ordered', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-s1'))
    expect(screen.getByTestId('page-series-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-title')).toHaveTextContent('Learning Rust')
    const list = screen.getByTestId('part-list')
    const items = within(list).getAllByRole('listitem')
    expect(items[0]).toHaveAttribute('data-testid', 'part-x1')
    expect(items[2]).toHaveAttribute('data-testid', 'part-x3')
  })

  it('toggles a part read state on the detail page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-s1'))
    expect(screen.getByTestId('part-x3')).toHaveAttribute('data-read', 'false')
    await user.click(screen.getByTestId('read-x3'))
    expect(screen.getByTestId('part-x3')).toHaveAttribute('data-read', 'true')
    await user.click(screen.getByTestId('read-x3'))
    expect(screen.getByTestId('part-x3')).toHaveAttribute('data-read', 'false')
  })

  it('updates the detail progress after marking a part read', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-s1'))
    expect(screen.getByTestId('detail-progress')).toHaveTextContent('67%')
    await user.click(screen.getByTestId('read-x3'))
    expect(screen.getByTestId('detail-progress')).toHaveTextContent('100%')
  })

  it('blocks adding a part with an empty title', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add-part'))
    await user.click(screen.getByTestId('submit-part'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-add-part')).toBeInTheDocument()
  })

  it('adds a part and lands on the series detail where it appears', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add-part'))
    await user.selectOptions(screen.getByTestId('series-select'), 's1')
    await user.type(screen.getByTestId('title-input'), 'Traits')
    await user.click(screen.getByTestId('submit-part'))
    expect(screen.getByTestId('page-series-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-title')).toHaveTextContent('Learning Rust')
    expect(within(screen.getByTestId('part-list')).getByText('Traits')).toBeInTheDocument()
    // new part appended with id x7
    expect(screen.getByTestId('part-x7')).toBeInTheDocument()
  })

  it('appended part gets the next order in its series', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add-part'))
    await user.selectOptions(screen.getByTestId('series-select'), 's2')
    await user.type(screen.getByTestId('title-input'), 'Streams')
    await user.click(screen.getByTestId('submit-part'))
    expect(screen.getByTestId('part-x7-order')).toHaveTextContent('4')
  })
})
