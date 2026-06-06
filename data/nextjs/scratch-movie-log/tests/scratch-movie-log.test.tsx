import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Movie Log', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('shows 4 seed movies', () => {
    expect(screen.getAllByTestId('movie-row')).toHaveLength(4)
  })

  it('shows movie-count of 4', () => {
    expect(screen.getByTestId('movie-count')).toHaveTextContent('4 movies')
  })

  it('shows correct average rating for seed data', () => {
    // (5+4+5+4)/4 = 4.5
    expect(screen.getByTestId('avg-rating')).toHaveTextContent('Avg: 4.5 ★')
  })

  it('displays seed movie titles', () => {
    expect(screen.getByText(/The Matrix/)).toBeInTheDocument()
    expect(screen.getByText(/Inception/)).toBeInTheDocument()
  })

  it('adds a new movie', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/^title$/i), 'Dune')
    await user.clear(screen.getByLabelText(/^year$/i))
    await user.type(screen.getByLabelText(/^year$/i), '2021')
    await user.click(screen.getByRole('button', { name: /add movie/i }))
    expect(screen.getAllByTestId('movie-row')).toHaveLength(5)
    expect(screen.getByText(/Dune/)).toBeInTheDocument()
  })

  it('clears form after adding', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/^title$/i), 'Dune')
    await user.clear(screen.getByLabelText(/^year$/i))
    await user.type(screen.getByLabelText(/^year$/i), '2021')
    await user.click(screen.getByRole('button', { name: /add movie/i }))
    expect(screen.getByLabelText(/^title$/i)).toHaveValue('')
    expect(screen.getByLabelText(/^year$/i)).toHaveValue(null)
  })

  it('does not add movie with empty title', async () => {
    const user = userEvent.setup()
    await user.clear(screen.getByLabelText(/^year$/i))
    await user.type(screen.getByLabelText(/^year$/i), '2020')
    await user.click(screen.getByRole('button', { name: /add movie/i }))
    expect(screen.getAllByTestId('movie-row')).toHaveLength(4)
  })

  it('does not add movie with out-of-range year', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/^title$/i), 'Bad Year')
    await user.clear(screen.getByLabelText(/^year$/i))
    await user.type(screen.getByLabelText(/^year$/i), '1800')
    await user.click(screen.getByRole('button', { name: /add movie/i }))
    expect(screen.getAllByTestId('movie-row')).toHaveLength(4)
  })

  it('removes a movie', async () => {
    const user = userEvent.setup()
    const rows = screen.getAllByTestId('movie-row')
    await user.click(within(rows[0]).getByRole('button', { name: /remove/i }))
    expect(screen.getAllByTestId('movie-row')).toHaveLength(3)
  })

  it('updates avg-rating after removal', async () => {
    const user = userEvent.setup()
    // remove a 5-star movie; remaining: 4+5+4=13/3=4.3...
    // default sort is Year (newest): rows are Knives Out(2019), Inception(2010), Matrix(1999), Godfather(1972)
    // remove first row = Knives Out (rating 4); remaining: 5+4+5=14/3=4.7
    const rows = screen.getAllByTestId('movie-row')
    await user.click(within(rows[0]).getByRole('button', { name: /remove/i }))
    expect(screen.getByTestId('avg-rating')).toHaveTextContent('Avg: 4.7 ★')
  })

  it('filters by genre', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter genre/i), 'Sci-Fi')
    expect(screen.getAllByTestId('movie-row')).toHaveLength(2)
    expect(screen.getByTestId('movie-count')).toHaveTextContent('2 movies')
  })

  it('avg-rating is unaffected by genre filter', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter genre/i), 'Drama')
    expect(screen.getByTestId('avg-rating')).toHaveTextContent('Avg: 4.5 ★')
  })

  it('sorts by title A-Z', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/sort by/i), 'Title (A-Z)')
    const rows = screen.getAllByTestId('movie-row')
    expect(rows[0]).toHaveTextContent('Inception')
  })

  it('sorts by year oldest first', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/sort by/i), 'Year (oldest)')
    const rows = screen.getAllByTestId('movie-row')
    expect(rows[0]).toHaveTextContent('The Godfather')
  })
})
