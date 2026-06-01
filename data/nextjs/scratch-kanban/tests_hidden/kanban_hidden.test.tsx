// HELD-OUT generalization tests. Never copied into the agent's rollout workdir — overlaid only
// at eval (run_nextjs_task extra_tests_dir). Fresh scenarios so a solution that merely satisfied
// the visible suite by hardcoding strings will fail these.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

function col(name: string): HTMLElement {
  return screen.getByRole('region', { name })
}
function liFor(name: string): HTMLElement {
  const li = screen.getByText(name).closest('li')
  if (!li) throw new Error(`no <li> for ${name}`)
  return li as HTMLElement
}
async function addCard(u: ReturnType<typeof userEvent.setup>, title: string) {
  await u.clear(screen.getByLabelText(/card title/i))
  await u.type(screen.getByLabelText(/card title/i), title)
  await u.click(screen.getByRole('button', { name: /add card/i }))
}
async function moveRight(u: ReturnType<typeof userEvent.setup>, title: string) {
  await u.click(within(liFor(title)).getByRole('button', { name: /move right/i }))
}

describe('Kanban (held-out)', () => {
  it('keeps counts consistent across four cards spread over columns', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addCard(u, 'one')
    await addCard(u, 'two')
    await addCard(u, 'three')
    await addCard(u, 'four')
    await moveRight(u, 'two') // -> In Progress
    await moveRight(u, 'three') // -> In Progress
    await moveRight(u, 'four')
    await moveRight(u, 'four') // -> Done
    expect(screen.getByRole('heading', { name: /backlog \(1\)/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /in progress \(2\)/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /done \(1\)/i })).toBeInTheDocument()
  })

  it('clamps at Done after extra right-moves', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addCard(u, 'edge')
    await moveRight(u, 'edge')
    await moveRight(u, 'edge')
    await moveRight(u, 'edge') // third move is a no-op (already in Done)
    expect(within(col('Done')).getByText('edge')).toBeInTheDocument()
    expect(within(liFor('edge')).getByRole('button', { name: /move right/i })).toBeDisabled()
  })

  it('walks a card all the way back left from Done to Backlog', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addCard(u, 'walker')
    await moveRight(u, 'walker')
    await moveRight(u, 'walker') // in Done
    await u.click(within(liFor('walker')).getByRole('button', { name: /move left/i }))
    await u.click(within(liFor('walker')).getByRole('button', { name: /move left/i }))
    expect(within(col('Backlog')).getByText('walker')).toBeInTheDocument()
    expect(within(liFor('walker')).getByRole('button', { name: /move left/i })).toBeDisabled()
  })

  it('appends new cards to Backlog without disturbing moved cards', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addCard(u, 'moved')
    await moveRight(u, 'moved') // In Progress
    await addCard(u, 'fresh')
    expect(within(col('In Progress')).getByText('moved')).toBeInTheDocument()
    expect(within(col('Backlog')).getByText('fresh')).toBeInTheDocument()
  })
})
