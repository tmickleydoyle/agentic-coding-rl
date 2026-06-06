import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Essay Outline App', () => {
  it('renders heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /essay outline/i })).toBeInTheDocument()
  })

  it('shows 2 seed sections', () => {
    render(<App />)
    expect(screen.getAllByTestId('section-item')).toHaveLength(2)
  })

  it('shows correct initial section count', () => {
    render(<App />)
    expect(screen.getByTestId('section-count').textContent).toBe('Sections: 2')
  })

  it('shows correct initial bullet count', () => {
    render(<App />)
    expect(screen.getByTestId('bullet-count').textContent).toBe('Bullets: 5')
  })

  it('shows Untitled Essay when title empty', () => {
    render(<App />)
    expect(screen.getByTestId('essay-title-display').textContent).toBe('Untitled Essay')
  })

  it('updates essay title display in real time', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByTestId('essay-title-input'), 'My Essay')
    expect(screen.getByTestId('essay-title-display').textContent).toBe('My Essay')
  })

  it('adds a new section', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/section title/i), 'Conclusion')
    await user.click(screen.getByRole('button', { name: /add section/i }))
    expect(screen.getAllByTestId('section-item')).toHaveLength(3)
    const titles = screen.getAllByTestId('section-title').map(el => el.textContent)
    expect(titles).toContain('Conclusion')
  })

  it('does not add section with empty title', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /add section/i }))
    expect(screen.getAllByTestId('section-item')).toHaveLength(2)
  })

  it('adds a bullet to a section', async () => {
    const user = userEvent.setup()
    render(<App />)
    const sections = screen.getAllByTestId('section-item')
    const intro = sections[0]
    await user.type(within(intro).getByLabelText(/bullet for introduction/i), 'Background context')
    await user.click(within(intro).getByRole('button', { name: /add bullet/i }))
    const bullets = within(intro).getAllByTestId('bullet-item')
    expect(bullets).toHaveLength(3)
    expect(within(intro).getAllByTestId('bullet-text').map(el => el.textContent)).toContain('Background context')
  })

  it('adding bullet clears that section input only', async () => {
    const user = userEvent.setup()
    render(<App />)
    const sections = screen.getAllByTestId('section-item')
    const intro = sections[0]
    await user.type(within(intro).getByLabelText(/bullet for introduction/i), 'A point')
    await user.click(within(intro).getByRole('button', { name: /add bullet/i }))
    expect(within(intro).getByLabelText(/bullet for introduction/i)).toHaveValue('')
  })

  it('deletes a section', async () => {
    const user = userEvent.setup()
    render(<App />)
    const sections = screen.getAllByTestId('section-item')
    await user.click(within(sections[0]).getByRole('button', { name: /delete section/i }))
    expect(screen.getAllByTestId('section-item')).toHaveLength(1)
    expect(screen.getByTestId('section-count').textContent).toBe('Sections: 1')
  })

  it('deleting section updates bullet count', async () => {
    const user = userEvent.setup()
    render(<App />)
    const sections = screen.getAllByTestId('section-item')
    // Introduction has 2 bullets
    await user.click(within(sections[0]).getByRole('button', { name: /delete section/i }))
    expect(screen.getByTestId('bullet-count').textContent).toBe('Bullets: 3')
  })

  it('removes a bullet', async () => {
    const user = userEvent.setup()
    render(<App />)
    const sections = screen.getAllByTestId('section-item')
    const intro = sections[0]
    const bullets = within(intro).getAllByTestId('bullet-item')
    await user.click(within(bullets[0]).getByRole('button', { name: /remove/i }))
    expect(within(intro).getAllByTestId('bullet-item')).toHaveLength(1)
    expect(screen.getByTestId('bullet-count').textContent).toBe('Bullets: 4')
  })

  it('bullet inputs are independent per section', async () => {
    const user = userEvent.setup()
    render(<App />)
    const sections = screen.getAllByTestId('section-item')
    await user.type(within(sections[0]).getByLabelText(/bullet for introduction/i), 'Hello')
    expect(within(sections[1]).getByLabelText(/bullet for body paragraph 1/i)).toHaveValue('')
  })
})
