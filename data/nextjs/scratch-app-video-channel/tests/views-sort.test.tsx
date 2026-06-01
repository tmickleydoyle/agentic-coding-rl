import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('views + sort flow', () => {
  it('recording a view bumps the count on the detail page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-v1'))
    expect(screen.getByTestId('detail-views')).toHaveTextContent('120')
    await user.click(screen.getByTestId('watch-btn'))
    expect(screen.getByTestId('detail-views')).toHaveTextContent('121')
    await user.click(screen.getByTestId('watch-btn'))
    expect(screen.getByTestId('detail-views')).toHaveTextContent('122')
  })

  it('view bump reflects back on the channel video row', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-v1'))
    await user.click(screen.getByTestId('watch-btn'))
    await user.click(screen.getByTestId('nav-channel'))
    expect(screen.getByTestId('cv-v1-views')).toHaveTextContent('121')
  })

  it('uploads default to recent sort (uploaded descending)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-uploads'))
    expect(screen.getByTestId('current-sort')).toHaveTextContent('recent')
    expect(screen.getByTestId('sort-recent')).toHaveAttribute('aria-pressed', 'true')
    const items = screen.getAllByTestId(/^up-v\d$/)
    // uploaded: v4=4, v1=3, v3=2, v2=1
    expect(items.map((el) => el.getAttribute('data-testid'))).toEqual([
      'up-v4',
      'up-v1',
      'up-v3',
      'up-v2',
    ])
  })

  it('sorting by views orders highest views first', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-uploads'))
    await user.click(screen.getByTestId('sort-views'))
    expect(screen.getByTestId('current-sort')).toHaveTextContent('views')
    expect(screen.getByTestId('sort-views')).toHaveAttribute('aria-pressed', 'true')
    const items = screen.getAllByTestId(/^up-v\d$/)
    // views: v3=200, v1=120, v2=90, v4=50
    expect(items.map((el) => el.getAttribute('data-testid'))).toEqual([
      'up-v3',
      'up-v1',
      'up-v2',
      'up-v4',
    ])
  })

  it('view sort accounts for session bumps', async () => {
    const user = userEvent.setup()
    render(<App />)
    // bump v4 enough to overtake v2 (50 -> needs >90 -> 41 bumps). Instead bump v2 to top? keep simple:
    // bump v1 (120) by 90 to reach 210 > v3(200) so v1 leads on views sort.
    await user.click(screen.getByTestId('open-v1'))
    for (let i = 0; i < 90; i += 1) {
      await user.click(screen.getByTestId('watch-btn'))
    }
    await user.click(screen.getByTestId('nav-uploads'))
    await user.click(screen.getByTestId('sort-views'))
    const items = screen.getAllByTestId(/^up-v\d$/)
    expect(items[0].getAttribute('data-testid')).toBe('up-v1')
  })
})
