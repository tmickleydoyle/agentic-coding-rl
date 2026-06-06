import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TabSwitcher from '../components/TabSwitcher'

const tabs = [
  { id: 'home', label: 'Home', content: 'Home content' },
  { id: 'about', label: 'About', content: 'About content' },
  { id: 'contact', label: 'Contact', content: 'Contact content' },
]

describe('TabSwitcher', () => {
  it('renders all tab buttons', () => {
    render(<TabSwitcher tabs={tabs} />)
    expect(screen.getByTestId('tab-home')).toBeDefined()
    expect(screen.getByTestId('tab-about')).toBeDefined()
    expect(screen.getByTestId('tab-contact')).toBeDefined()
  })

  it('first tab is active by default', () => {
    render(<TabSwitcher tabs={tabs} />)
    expect(screen.getByTestId('tab-home').getAttribute('aria-selected')).toBe('true')
  })

  it('shows first tab content by default', () => {
    render(<TabSwitcher tabs={tabs} />)
    expect(screen.getByTestId('tab-panel').textContent).toContain('Home content')
  })

  it('switches content when another tab is clicked', async () => {
    const user = userEvent.setup()
    render(<TabSwitcher tabs={tabs} />)
    await user.click(screen.getByTestId('tab-about'))
    expect(screen.getByTestId('tab-panel').textContent).toContain('About content')
  })

  it('sets clicked tab aria-selected to true', async () => {
    const user = userEvent.setup()
    render(<TabSwitcher tabs={tabs} />)
    await user.click(screen.getByTestId('tab-about'))
    expect(screen.getByTestId('tab-about').getAttribute('aria-selected')).toBe('true')
  })

  it('sets previous tab aria-selected to false after switch', async () => {
    const user = userEvent.setup()
    render(<TabSwitcher tabs={tabs} />)
    await user.click(screen.getByTestId('tab-about'))
    expect(screen.getByTestId('tab-home').getAttribute('aria-selected')).toBe('false')
  })
})
