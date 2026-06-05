import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function gotoMove(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByTestId('nav-move'))
}

describe('move flow', () => {
  it('moves items from one bin to another and updates usage', async () => {
    const user = userEvent.setup()
    render(<App />)
    await gotoMove(user)
    await user.selectOptions(screen.getByTestId('from-bin'), 'b1')
    await user.selectOptions(screen.getByTestId('to-bin'), 'b3')
    await user.type(screen.getByTestId('item-name'), 'Bolts')
    await user.clear(screen.getByTestId('move-qty'))
    await user.type(screen.getByTestId('move-qty'), '10')
    await user.click(screen.getByTestId('do-move'))
    expect(screen.getByTestId('move-success')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-bins'))
    expect(screen.getByTestId('bin-b1-used')).toHaveTextContent('50')
    expect(screen.getByTestId('bin-b3-used')).toHaveTextContent('10')
  })

  it('creates the item in the destination bin if absent', async () => {
    const user = userEvent.setup()
    render(<App />)
    await gotoMove(user)
    await user.selectOptions(screen.getByTestId('from-bin'), 'b1')
    await user.selectOptions(screen.getByTestId('to-bin'), 'b3')
    await user.type(screen.getByTestId('item-name'), 'Nuts')
    await user.clear(screen.getByTestId('move-qty'))
    await user.type(screen.getByTestId('move-qty'), '5')
    await user.click(screen.getByTestId('do-move'))
    await user.click(screen.getByTestId('nav-bins'))
    await user.click(screen.getByTestId('view-b3'))
    expect(screen.getByTestId('item-Nuts-qty')).toHaveTextContent('5')
  })

  it('rejects a move when the source lacks enough stock', async () => {
    const user = userEvent.setup()
    render(<App />)
    await gotoMove(user)
    await user.selectOptions(screen.getByTestId('from-bin'), 'b1')
    await user.selectOptions(screen.getByTestId('to-bin'), 'b3')
    await user.type(screen.getByTestId('item-name'), 'Bolts')
    await user.clear(screen.getByTestId('move-qty'))
    await user.type(screen.getByTestId('move-qty'), '999')
    await user.click(screen.getByTestId('do-move'))
    expect(screen.getByTestId('move-error')).toHaveTextContent('not enough stock')
    expect(screen.queryByTestId('move-success')).not.toBeInTheDocument()
  })

  it('rejects a move when the destination lacks free space', async () => {
    const user = userEvent.setup()
    render(<App />)
    await gotoMove(user)
    await user.selectOptions(screen.getByTestId('from-bin'), 'b1')
    await user.selectOptions(screen.getByTestId('to-bin'), 'b2') // b2 is full
    await user.type(screen.getByTestId('item-name'), 'Bolts')
    await user.clear(screen.getByTestId('move-qty'))
    await user.type(screen.getByTestId('move-qty'), '5')
    await user.click(screen.getByTestId('do-move'))
    expect(screen.getByTestId('move-error')).toHaveTextContent('not enough space')
  })

  it('rejects moving into the same bin', async () => {
    const user = userEvent.setup()
    render(<App />)
    await gotoMove(user)
    await user.selectOptions(screen.getByTestId('from-bin'), 'b1')
    await user.selectOptions(screen.getByTestId('to-bin'), 'b1')
    await user.type(screen.getByTestId('item-name'), 'Bolts')
    await user.clear(screen.getByTestId('move-qty'))
    await user.type(screen.getByTestId('move-qty'), '5')
    await user.click(screen.getByTestId('do-move'))
    expect(screen.getByTestId('move-error')).toHaveTextContent('same bin')
  })

  it('removes the item from the source when fully moved out', async () => {
    const user = userEvent.setup()
    render(<App />)
    await gotoMove(user)
    await user.selectOptions(screen.getByTestId('from-bin'), 'b1')
    await user.selectOptions(screen.getByTestId('to-bin'), 'b3')
    await user.type(screen.getByTestId('item-name'), 'Nuts')
    await user.clear(screen.getByTestId('move-qty'))
    await user.type(screen.getByTestId('move-qty'), '20') // all Nuts
    await user.click(screen.getByTestId('do-move'))
    await user.click(screen.getByTestId('nav-bins'))
    await user.click(screen.getByTestId('view-b1'))
    expect(screen.queryByTestId('item-Nuts')).not.toBeInTheDocument()
    expect(screen.getByTestId('item-Bolts')).toBeInTheDocument()
  })
})
