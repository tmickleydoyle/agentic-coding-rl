import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('warehouse map', () => {
  it('shows overall usage across all bins', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-map'))
    // used 60 + 50 + 0 = 110, capacity 100 + 50 + 80 = 230 => 48%
    expect(screen.getByTestId('overall-usage')).toHaveTextContent('110/230 (48%)')
    expect(screen.getByTestId('bin-count')).toHaveTextContent('3 bins')
  })

  it('renders a map cell per bin with its usage', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-map'))
    expect(screen.getByTestId('cell-b1')).toHaveAttribute('data-usage', '60')
    expect(screen.getByTestId('cell-b2')).toHaveAttribute('data-usage', '100')
    expect(screen.getByTestId('cell-b3')).toHaveAttribute('data-usage', '0')
  })

  it('opens a bin detail from a map cell', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-map'))
    await user.click(screen.getByTestId('cell-b2'))
    expect(screen.getByTestId('page-bin-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-code')).toHaveTextContent('A2')
  })

  it('updates overall usage is unchanged by a move (conservation)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-move'))
    await user.selectOptions(screen.getByTestId('from-bin'), 'b1')
    await user.selectOptions(screen.getByTestId('to-bin'), 'b3')
    await user.type(screen.getByTestId('item-name'), 'Bolts')
    await user.clear(screen.getByTestId('move-qty'))
    await user.type(screen.getByTestId('move-qty'), '10')
    await user.click(screen.getByTestId('do-move'))
    await user.click(screen.getByTestId('nav-map'))
    expect(screen.getByTestId('overall-usage')).toHaveTextContent('110/230')
  })

  it('toggles theme and persists across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-map'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
    await user.click(screen.getByTestId('theme-toggle'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
    await user.click(screen.getByTestId('nav-bins'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
  })
})
