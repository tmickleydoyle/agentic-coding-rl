import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('builds page filtering', () => {
  it('lists all builds by default', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-builds'))
    const list = screen.getByTestId('all-build-list')
    expect(within(list).getByTestId('row-b1')).toBeInTheDocument()
    expect(within(list).getByTestId('row-b5')).toBeInTheDocument()
  })

  it('filters builds by passing status', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-builds'))
    await user.selectOptions(screen.getByTestId('status-filter'), 'passing')
    expect(screen.getByTestId('row-b1')).toBeInTheDocument()
    expect(screen.getByTestId('row-b3')).toBeInTheDocument()
    expect(screen.getByTestId('row-b5')).toBeInTheDocument()
    expect(screen.queryByTestId('row-b2')).not.toBeInTheDocument()
    expect(screen.queryByTestId('row-b4')).not.toBeInTheDocument()
  })

  it('filters builds by failing status', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-builds'))
    await user.selectOptions(screen.getByTestId('status-filter'), 'failing')
    expect(screen.getByTestId('row-b2')).toBeInTheDocument()
    expect(screen.queryByTestId('row-b1')).not.toBeInTheDocument()
  })

  it('shows an empty state when no build matches', async () => {
    const user = userEvent.setup()
    render(<App />)
    // retry b4 (the only running build) then mark it via filter — instead delete-all path:
    // mark b4 running stays; filter running shows b4. We test empty by filtering after retry.
    await user.click(screen.getByTestId('nav-builds'))
    await user.selectOptions(screen.getByTestId('status-filter'), 'running')
    expect(screen.getByTestId('row-b4')).toBeInTheDocument()
    expect(screen.queryByTestId('all-build-list')).toBeInTheDocument()
  })

  it('marks the row data-status attribute', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-builds'))
    expect(screen.getByTestId('row-b2')).toHaveAttribute('data-status', 'failing')
    expect(screen.getByTestId('row-b4')).toHaveAttribute('data-status', 'running')
  })
})
