import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('profile', () => {
  it('shows no-selection when no employee is chosen', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-profile'))
    expect(screen.getByTestId('no-selection')).toBeInTheDocument()
  })

  it('opens a profile from the directory and shows details', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-e2'))
    expect(screen.getByTestId('page-profile')).toBeInTheDocument()
    expect(screen.getByTestId('profile-name')).toHaveTextContent('Alan Turing')
    expect(screen.getByTestId('profile-dept')).toHaveTextContent('Engineering')
    expect(screen.getByTestId('profile-manager')).toHaveTextContent('Ada Lovelace')
  })

  it('shows direct reports and can drill into one', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-e2'))
    expect(screen.getByTestId('report-e3')).toBeInTheDocument()
    await user.click(screen.getByTestId('open-report-e3'))
    expect(screen.getByTestId('profile-name')).toHaveTextContent('Grace Hopper')
    expect(screen.getByTestId('profile-manager')).toHaveTextContent('Alan Turing')
  })

  it('shows None as manager for the CEO', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-e1'))
    expect(screen.getByTestId('profile-manager')).toHaveTextContent('None')
  })
})

describe('departments and org', () => {
  it('shows per-department counts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-departments'))
    expect(screen.getByTestId('dept-Engineering-count')).toHaveTextContent('2')
    expect(screen.getByTestId('dept-Sales-count')).toHaveTextContent('2')
    expect(screen.getByTestId('dept-Executive-count')).toHaveTextContent('1')
  })

  it('renders the org tree rooted at the CEO with nested reports', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-org'))
    const root = screen.getByTestId('org-e1')
    expect(within(root).getByTestId('org-e2')).toBeInTheDocument()
    expect(within(root).getByTestId('org-e3')).toBeInTheDocument()
    expect(within(root).getByTestId('org-e4')).toBeInTheDocument()
  })

  it('opens a profile from the org tree', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-org'))
    await user.click(screen.getByTestId('org-open-e5'))
    expect(screen.getByTestId('page-profile')).toBeInTheDocument()
    expect(screen.getByTestId('profile-name')).toHaveTextContent('Mary Jackson')
  })
})

describe('theme', () => {
  it('toggles theme on the departments page and persists', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
    await user.click(screen.getByTestId('nav-departments'))
    await user.click(screen.getByTestId('theme-toggle'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
    await user.click(screen.getByTestId('nav-org'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
  })
})
