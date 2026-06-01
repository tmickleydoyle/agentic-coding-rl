import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('browse', () => {
  it('groups videos by category in first-seen order', () => {
    render(<App />)
    expect(screen.getByTestId('category-React-label')).toHaveTextContent('React')
    expect(screen.getByTestId('category-TypeScript-label')).toHaveTextContent('TypeScript')
    expect(screen.getByTestId('category-CSS-label')).toHaveTextContent('CSS')
  })

  it('shows videos with their titles and durations within categories', () => {
    render(<App />)
    const react = screen.getByTestId('category-React')
    expect(within(react).getByTestId('video-v1-title')).toHaveTextContent('Intro to Hooks')
    expect(within(react).getByTestId('video-v1-duration')).toHaveTextContent('600')
    expect(within(react).getByTestId('video-v4')).toBeInTheDocument()
    const css = screen.getByTestId('category-CSS')
    expect(within(css).getByTestId('video-v3')).toBeInTheDocument()
    expect(within(css).getByTestId('video-v5')).toBeInTheDocument()
  })

  it('shows no badges initially', () => {
    render(<App />)
    expect(screen.queryByTestId('watched-badge-v1')).not.toBeInTheDocument()
    expect(screen.queryByTestId('watchlist-badge-v1')).not.toBeInTheDocument()
  })

  it('opening a video navigates to detail with its title and category', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-v2'))
    expect(screen.getByTestId('page-video-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-title')).toHaveTextContent('Advanced Generics')
    expect(screen.getByTestId('detail-category')).toHaveTextContent('TypeScript')
    expect(screen.getByTestId('detail-duration')).toHaveTextContent('900')
  })

  it('shows a watched badge on browse after marking watched', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-v1'))
    await user.click(screen.getByTestId('watch-btn'))
    await user.click(screen.getByTestId('nav-browse'))
    expect(screen.getByTestId('watched-badge-v1')).toBeInTheDocument()
    expect(screen.queryByTestId('watched-badge-v2')).not.toBeInTheDocument()
  })

  it('shows a watchlist badge on browse after saving', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-v3'))
    await user.click(screen.getByTestId('watchlist-toggle'))
    await user.click(screen.getByTestId('nav-browse'))
    expect(screen.getByTestId('watchlist-badge-v3')).toBeInTheDocument()
  })
})
