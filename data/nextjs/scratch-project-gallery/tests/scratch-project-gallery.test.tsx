import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Project Gallery', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the heading', () => {
    expect(screen.getByRole('heading', { name: 'Project Gallery' })).toBeTruthy()
  })

  it('shows initial project count as 4 projects', () => {
    expect(screen.getByTestId('project-count').textContent).toBe('4 projects')
  })

  it('renders all 4 seed project cards', () => {
    expect(screen.getAllByTestId('project-card')).toHaveLength(4)
  })

  it('shows Featured for featured projects', () => {
    const cards = screen.getAllByTestId('project-card')
    const neonCard = cards.find(c => within(c).getByTestId('project-title').textContent === 'Neon City')!
    expect(within(neonCard).getByTestId('project-featured').textContent).toBe('Featured')
  })

  it('shows Standard for non-featured projects', () => {
    const cards = screen.getAllByTestId('project-card')
    const forestCard = cards.find(c => within(c).getByTestId('project-title').textContent === 'Forest Sounds')!
    expect(within(forestCard).getByTestId('project-featured').textContent).toBe('Standard')
  })

  it('shows tags as comma-joined string', () => {
    const cards = screen.getAllByTestId('project-card')
    const neonCard = cards.find(c => within(c).getByTestId('project-title').textContent === 'Neon City')!
    expect(within(neonCard).getByTestId('project-tags').textContent).toBe('digital,neon')
  })

  it('filters projects by title text', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('filter-input'), 'paper')
    const cards = screen.getAllByTestId('project-card')
    expect(cards).toHaveLength(1)
    expect(within(cards[0]).getByTestId('project-title').textContent).toBe('Paper Worlds')
  })

  it('filters projects by featured checkbox', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('filter-featured'))
    expect(screen.getAllByTestId('project-card')).toHaveLength(2)
  })

  it('toggles featured status', async () => {
    const user = userEvent.setup()
    const cards = screen.getAllByTestId('project-card')
    const forestCard = cards.find(c => within(c).getByTestId('project-title').textContent === 'Forest Sounds')!
    const btn = within(forestCard).getByTestId('toggle-featured')
    expect(btn.textContent).toBe('Feature')
    await user.click(btn)
    expect(within(forestCard).getByTestId('project-featured').textContent).toBe('Featured')
  })

  it('deletes a project and updates count', async () => {
    const user = userEvent.setup()
    await user.click(within(screen.getAllByTestId('project-card')[0]).getByTestId('delete-project'))
    expect(screen.getAllByTestId('project-card')).toHaveLength(3)
    expect(screen.getByTestId('project-count').textContent).toBe('3 projects')
  })

  it('adds a valid new project', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-title'), 'New Work')
    await user.type(screen.getByTestId('input-description'), 'A new creative work')
    await user.type(screen.getByTestId('input-tags'), 'new,creative')
    await user.click(screen.getByTestId('submit-project'))
    expect(screen.getAllByTestId('project-card')).toHaveLength(5)
    expect(screen.getByTestId('project-count').textContent).toBe('5 projects')
  })

  it('splits tags correctly on submission', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-title'), 'Tagged Work')
    await user.type(screen.getByTestId('input-description'), 'Has tags')
    await user.type(screen.getByTestId('input-tags'), 'alpha, beta, gamma')
    await user.click(screen.getByTestId('submit-project'))
    const cards = screen.getAllByTestId('project-card')
    const newCard = cards.find(c => within(c).getByTestId('project-title').textContent === 'Tagged Work')!
    expect(within(newCard).getByTestId('project-tags').textContent).toBe('alpha,beta,gamma')
  })

  it('shows form error when title is empty', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-description'), 'No title')
    await user.click(screen.getByTestId('submit-project'))
    expect(screen.getByTestId('form-error').textContent).toBe('Title and description are required.')
  })

  it('project-count reflects total not filtered count', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('filter-input'), 'neon')
    expect(screen.getByTestId('project-count').textContent).toBe('4 projects')
  })
})
