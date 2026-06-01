import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('pipeline flow', () => {
  it('lists seeded pipelines', () => {
    render(<App />)
    const list = screen.getByTestId('pipeline-list')
    expect(within(list).getByText('Web App')).toBeInTheDocument()
    expect(within(list).getByText('API')).toBeInTheDocument()
    expect(within(list).getByText('Worker')).toBeInTheDocument()
    expect(screen.getByTestId('pipeline-pl1-repo')).toHaveTextContent('acme/web')
  })

  it('shows a no-selection message before selecting', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-pipeline-detail'))
    expect(screen.getByTestId('no-selection')).toBeInTheDocument()
  })

  it('selecting a pipeline navigates to its detail with its builds', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('select-pl1'))
    expect(screen.getByTestId('page-pipeline-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-name')).toHaveTextContent('Web App')
    const list = screen.getByTestId('build-list')
    expect(within(list).getByTestId('build-b1')).toBeInTheDocument()
    expect(within(list).getByTestId('build-b2')).toBeInTheDocument()
    expect(within(list).queryByTestId('build-b3')).not.toBeInTheDocument()
  })

  it('retrying a build sets its status to running', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('select-pl1'))
    expect(screen.getByTestId('build-b2')).toHaveAttribute('data-status', 'failing')
    await user.click(screen.getByTestId('retry-b2'))
    expect(screen.getByTestId('build-b2')).toHaveAttribute('data-status', 'running')
    expect(screen.getByTestId('build-b2-status')).toHaveTextContent('running')
  })

  it('shows only the builds for the selected pipeline (pl2)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('select-pl2'))
    expect(screen.getByTestId('detail-name')).toHaveTextContent('API')
    expect(screen.getByTestId('build-b3')).toBeInTheDocument()
    expect(screen.getByTestId('build-b4')).toBeInTheDocument()
    expect(screen.queryByTestId('build-b1')).not.toBeInTheDocument()
  })
})
