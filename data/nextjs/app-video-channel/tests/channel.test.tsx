import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('channel page', () => {
  it('lists the selected channel videos with views', () => {
    render(<App />)
    const list = screen.getByTestId('channel-videos')
    expect(within(list).getByTestId('cv-v1-title')).toHaveTextContent('Hooks Explained')
    expect(within(list).getByTestId('cv-v1-views')).toHaveTextContent('120')
    expect(within(list).getByTestId('cv-v2-title')).toHaveTextContent('Context Deep Dive')
    expect(within(list).queryByTestId('cv-v3')).not.toBeInTheDocument()
  })

  it('switches channels and lists the other channel videos', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('switch-ch2'))
    expect(screen.getByTestId('channel-name')).toHaveTextContent('DesignDaily')
    expect(screen.getByTestId('cv-v3-title')).toHaveTextContent('Color Theory')
    expect(screen.queryByTestId('cv-v1')).not.toBeInTheDocument()
  })

  it('subscribes and unsubscribes a channel', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.queryByTestId('subscriber-flag')).not.toBeInTheDocument()
    expect(screen.getByTestId('subscribe-toggle')).toHaveTextContent('Subscribe')
    await user.click(screen.getByTestId('subscribe-toggle'))
    expect(screen.getByTestId('subscriber-flag')).toBeInTheDocument()
    expect(screen.getByTestId('subscribe-toggle')).toHaveTextContent('Unsubscribe')
    await user.click(screen.getByTestId('subscribe-toggle'))
    expect(screen.queryByTestId('subscriber-flag')).not.toBeInTheDocument()
  })

  it('opens a video to its detail page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-v1'))
    expect(screen.getByTestId('page-video-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-title')).toHaveTextContent('Hooks Explained')
    expect(screen.getByTestId('detail-channel')).toHaveTextContent('CodeCast')
    expect(screen.getByTestId('detail-views')).toHaveTextContent('120')
  })
})
