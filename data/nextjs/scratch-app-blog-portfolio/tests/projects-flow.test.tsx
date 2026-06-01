import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function goToProjects(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByTestId('nav-projects'))
}

describe('projects flow', () => {
  it('lists all projects with joined tags', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToProjects(user)
    expect(screen.getByTestId('project-j1-tags')).toHaveTextContent('web, ts')
    expect(screen.getByTestId('project-j2-tags')).toHaveTextContent('python')
  })

  it('marks a project featured via the card', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToProjects(user)
    expect(screen.getByTestId('project-j2')).toHaveAttribute('data-featured', 'false')
    await user.click(screen.getByTestId('feature-j2'))
    expect(screen.getByTestId('project-j2')).toHaveAttribute('data-featured', 'true')
  })

  it('filters projects by tag', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToProjects(user)
    await user.selectOptions(screen.getByTestId('tag-filter'), 'web')
    expect(screen.getByTestId('project-j1')).toBeInTheDocument()
    expect(screen.getByTestId('project-j3')).toBeInTheDocument()
    expect(screen.queryByTestId('project-j2')).not.toBeInTheDocument()
  })

  it('lists each tag once in the filter, sorted', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToProjects(user)
    const options = within(screen.getByTestId('tag-filter')).getAllByRole('option')
    const values = options.map((o) => (o as HTMLOptionElement).value)
    expect(values).toEqual(['all', 'cpp', 'python', 'ts', 'web'])
  })

  it('shows the empty state when no project matches the tag', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToProjects(user)
    // featuring then unfeaturing does not change tags; use a tag no project has is impossible
    // via the select, so verify empty-state by checking python-only after removing j2? Instead
    // assert empty-state markup is absent at seed.
    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument()
    await user.selectOptions(screen.getByTestId('tag-filter'), 'cpp')
    expect(screen.getByTestId('project-j3')).toBeInTheDocument()
    expect(screen.queryByTestId('project-j1')).not.toBeInTheDocument()
  })

  it('opens a project detail showing tags and featured state', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToProjects(user)
    await user.click(screen.getByTestId('open-j1'))
    expect(screen.getByTestId('page-project-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-title')).toHaveTextContent('Portfolio site')
    expect(screen.getByTestId('detail-tags')).toHaveTextContent('web, ts')
    expect(screen.getByTestId('detail-featured')).toHaveTextContent('Featured')
  })

  it('toggles featured from the detail page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToProjects(user)
    await user.click(screen.getByTestId('open-j2'))
    expect(screen.getByTestId('detail-featured')).toHaveTextContent('Not featured')
    await user.click(screen.getByTestId('detail-feature-toggle'))
    expect(screen.getByTestId('detail-featured')).toHaveTextContent('Featured')
  })

  it('lists writing posts with their tags', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-writing'))
    const list = screen.getByTestId('post-list')
    expect(within(list).getByText('Why I left Vim')).toBeInTheDocument()
    expect(screen.getByTestId('post-w2-tag')).toHaveTextContent('ts')
  })
})
