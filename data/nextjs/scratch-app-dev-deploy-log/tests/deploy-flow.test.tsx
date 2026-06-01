import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('deployment flow', () => {
  it('lists seeded deployments', () => {
    render(<App />)
    const list = screen.getByTestId('deploy-list')
    expect(within(list).getByTestId('deploy-d1')).toBeInTheDocument()
    expect(within(list).getByTestId('deploy-d2')).toBeInTheDocument()
    expect(within(list).getByTestId('deploy-d3')).toBeInTheDocument()
  })

  it('shows service, env and status on a row', () => {
    render(<App />)
    expect(screen.getByTestId('deploy-d1-service')).toHaveTextContent('api')
    expect(screen.getByTestId('deploy-d1-env')).toHaveTextContent('prod')
    expect(screen.getByTestId('deploy-d1')).toHaveAttribute('data-status', 'success')
  })

  it('rolls back a deployment from the list', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('deploy-d1')).toHaveAttribute('data-status', 'success')
    await user.click(screen.getByTestId('rollback-d1'))
    expect(screen.getByTestId('deploy-d1')).toHaveAttribute('data-status', 'rolled_back')
  })

  it('filters deployments by environment', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('env-filter'), 'prod')
    expect(screen.getByTestId('deploy-d1')).toBeInTheDocument()
    expect(screen.queryByTestId('deploy-d2')).not.toBeInTheDocument()
    expect(screen.queryByTestId('deploy-d3')).not.toBeInTheDocument()
  })

  it('opens the detail page for a deployment and shows its status timeline', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-d1'))
    expect(screen.getByTestId('page-deploy-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-service')).toHaveTextContent('api')
    // d1 is success: all three stages reached
    expect(screen.getByTestId('stage-queued')).toHaveAttribute('data-reached', 'true')
    expect(screen.getByTestId('stage-building')).toHaveAttribute('data-reached', 'true')
    expect(screen.getByTestId('stage-success')).toHaveAttribute('data-reached', 'true')
  })

  it('a failed deployment has not reached the success stage', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-d2'))
    // d2 is failed
    expect(screen.getByTestId('stage-queued')).toHaveAttribute('data-reached', 'true')
    expect(screen.getByTestId('stage-building')).toHaveAttribute('data-reached', 'true')
    expect(screen.getByTestId('stage-success')).toHaveAttribute('data-reached', 'false')
  })

  it('rolls back from the detail page and updates the status timeline', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-d1'))
    await user.click(screen.getByTestId('rollback-detail'))
    expect(screen.getByTestId('detail-status')).toHaveTextContent('rolled_back')
    expect(screen.getByTestId('stage-success')).toHaveAttribute('data-reached', 'false')
  })
})
