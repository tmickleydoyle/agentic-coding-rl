import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the play page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-play')).toBeInTheDocument()
    expect(screen.getByTestId('nav-play')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-stats')).not.toHaveAttribute('aria-current')
  })

  it('navigates to stats', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-stats'))
    expect(screen.getByTestId('page-stats')).toBeInTheDocument()
  })

  it('navigates to words', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-words'))
    expect(screen.getByTestId('page-words')).toBeInTheDocument()
  })

  it('navigates to how-to with rules', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-how-to'))
    expect(screen.getByTestId('rules-intro')).toBeInTheDocument()
    expect(screen.getByTestId('rules').querySelectorAll('li').length).toBeGreaterThanOrEqual(3)
  })

  it('starts masking the first word (cat) with six chances', () => {
    render(<App />)
    expect(screen.getByTestId('masked')).toHaveTextContent('___')
    expect(screen.getByTestId('remaining')).toHaveTextContent('6')
    expect(screen.getByTestId('status')).toHaveTextContent('playing')
  })
})
