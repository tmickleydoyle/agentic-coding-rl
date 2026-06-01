import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('lyric search', () => {
  it('shows search-empty for a blank query', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-search'))
    expect(screen.getByTestId('search-empty')).toBeInTheDocument()
    expect(screen.queryByTestId('search-results')).not.toBeInTheDocument()
  })

  it('finds a line by text (case-insensitive)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-search'))
    await user.type(screen.getByTestId('search-input'), 'NEON')
    expect(screen.getByTestId('sresult-g3-0')).toBeInTheDocument()
    expect(screen.getByTestId('sresult-g3-0-line')).toHaveTextContent('Neon city lights')
    expect(screen.getByTestId('sresult-g3-0-title')).toHaveTextContent('City Lights')
  })

  it('returns multiple matches across songs', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-search'))
    // "sea" appears in g2 line 1; "the" appears in several lines
    await user.type(screen.getByTestId('search-input'), 'the')
    // g1 line1 "Chasing the sun", g3 line1 "Dancing in the rain", g3 line2 "Lost in the sound"
    expect(screen.getByTestId('sresult-g1-1')).toBeInTheDocument()
    expect(screen.getByTestId('sresult-g3-1')).toBeInTheDocument()
    expect(screen.getByTestId('sresult-g3-2')).toBeInTheDocument()
  })

  it('shows search-empty when nothing matches', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-search'))
    await user.type(screen.getByTestId('search-input'), 'zzz')
    expect(screen.getByTestId('search-empty')).toBeInTheDocument()
    expect(screen.queryByTestId('search-results')).not.toBeInTheDocument()
  })
})
