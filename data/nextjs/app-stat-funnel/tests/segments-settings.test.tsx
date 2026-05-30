import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('segments comparison', () => {
  it('shows overall conversion per compared segment (not all)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-segments'))
    // mobile 40/600 = 7 ; desktop 80/400 = 20
    expect(screen.getByTestId('seg-mobile-conversion')).toHaveTextContent('7')
    expect(screen.getByTestId('seg-desktop-conversion')).toHaveTextContent('20')
    expect(screen.queryByTestId('seg-all')).not.toBeInTheDocument()
  })

  it('is independent of the active segment filter', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('segment-filter'), 'mobile')
    await user.click(screen.getByTestId('nav-segments'))
    // still shows both, with their own conversions
    expect(screen.getByTestId('seg-mobile-conversion')).toHaveTextContent('7')
    expect(screen.getByTestId('seg-desktop-conversion')).toHaveTextContent('20')
  })
})

describe('settings', () => {
  it('toggles the theme and reflects it on the root persistently', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
    await user.click(screen.getByTestId('nav-settings'))
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
    await user.click(screen.getByTestId('toggle-theme'))
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
    await user.click(screen.getByTestId('nav-funnel'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
  })

  it('changing the segment in settings affects the funnel page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    await user.selectOptions(screen.getByTestId('default-segment'), 'desktop')
    await user.click(screen.getByTestId('nav-funnel'))
    expect(screen.getByTestId('frow-st1-count')).toHaveTextContent('400')
    expect(screen.getByTestId('overall-conversion')).toHaveTextContent('20')
  })
})
