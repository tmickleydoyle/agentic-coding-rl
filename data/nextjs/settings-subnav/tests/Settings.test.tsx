import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Settings from '../components/Settings'

describe('Settings sub-pages', () => {
  it('starts on Profile; sub-profile is aria-current', () => {
    render(<Settings />)
    expect(screen.getByTestId('sub-profile')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('sub-privacy')).not.toHaveAttribute('aria-current')
    expect(within(screen.getByTestId('section')).getByTestId('display-name')).toBeInTheDocument()
  })

  it('navigating to Privacy shows the privacy controls', async () => {
    const user = userEvent.setup()
    render(<Settings />)
    await user.click(screen.getByTestId('sub-privacy'))
    expect(screen.getByTestId('sub-privacy')).toHaveAttribute('aria-current', 'page')
    expect(within(screen.getByTestId('section')).getByTestId('public-toggle')).toBeInTheDocument()
    expect(within(screen.getByTestId('section')).getByTestId('visibility')).toHaveTextContent('private')
  })

  it('privacy toggle flips between public and private', async () => {
    const user = userEvent.setup()
    render(<Settings />)
    await user.click(screen.getByTestId('sub-privacy'))
    const btn = screen.getByTestId('public-toggle')
    expect(btn).toHaveTextContent('Make profile public')
    await user.click(btn)
    expect(screen.getByTestId('visibility')).toHaveTextContent('public')
    expect(btn).toHaveTextContent('Make profile private')
  })

  it('profile name persists across navigation away and back', async () => {
    const user = userEvent.setup()
    render(<Settings />)
    await user.type(screen.getByTestId('display-name'), 'Ada')
    await user.click(screen.getByTestId('sub-privacy'))
    await user.click(screen.getByTestId('sub-profile'))
    expect((screen.getByTestId('display-name') as HTMLInputElement).value).toBe('Ada')
  })

  it('email-pref checkbox persists across navigation', async () => {
    const user = userEvent.setup()
    render(<Settings />)
    await user.click(screen.getByTestId('sub-notifications'))
    const cb = screen.getByTestId('email-pref')
    expect(cb).not.toBeChecked()
    await user.click(cb)
    await user.click(screen.getByTestId('sub-profile'))
    await user.click(screen.getByTestId('sub-notifications'))
    expect(screen.getByTestId('email-pref')).toBeChecked()
  })
})
