import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Carousel from '../components/Carousel'

const SLIDES = [
  { id: 's1', caption: 'One' },
  { id: 's2', caption: 'Two' },
  { id: 's3', caption: 'Three' },
]

describe('Carousel', () => {
  it('shows the first slide and marks the first dot active', () => {
    render(<Carousel slides={SLIDES} />)
    expect(screen.getByTestId('slide')).toHaveTextContent('One')
    expect(screen.getByTestId('dot-0')).toHaveAttribute('aria-current', 'true')
    expect(screen.getByTestId('dot-1')).not.toHaveAttribute('aria-current')
  })

  it('renders one dot per slide', () => {
    render(<Carousel slides={SLIDES} />)
    expect(screen.getAllByTestId(/^dot-/)).toHaveLength(3)
  })

  it('Next advances to the following slide', async () => {
    const user = userEvent.setup()
    render(<Carousel slides={SLIDES} />)
    await user.click(screen.getByTestId('next'))
    expect(screen.getByTestId('slide')).toHaveTextContent('Two')
    expect(screen.getByTestId('dot-1')).toHaveAttribute('aria-current', 'true')
  })

  it('Next wraps from the last slide back to the first', async () => {
    const user = userEvent.setup()
    render(<Carousel slides={SLIDES} />)
    await user.click(screen.getByTestId('next'))
    await user.click(screen.getByTestId('next'))
    expect(screen.getByTestId('slide')).toHaveTextContent('Three')
    await user.click(screen.getByTestId('next'))
    expect(screen.getByTestId('slide')).toHaveTextContent('One')
    expect(screen.getByTestId('dot-0')).toHaveAttribute('aria-current', 'true')
  })

  it('Prev wraps from the first slide to the last', async () => {
    const user = userEvent.setup()
    render(<Carousel slides={SLIDES} />)
    await user.click(screen.getByTestId('prev'))
    expect(screen.getByTestId('slide')).toHaveTextContent('Three')
    expect(screen.getByTestId('dot-2')).toHaveAttribute('aria-current', 'true')
  })

  it('clicking a dot jumps to that slide', async () => {
    const user = userEvent.setup()
    render(<Carousel slides={SLIDES} />)
    await user.click(screen.getByTestId('dot-2'))
    expect(screen.getByTestId('slide')).toHaveTextContent('Three')
    await user.click(screen.getByTestId('dot-1'))
    expect(screen.getByTestId('slide')).toHaveTextContent('Two')
  })

  it('shows exactly one slide caption at a time', async () => {
    const user = userEvent.setup()
    render(<Carousel slides={SLIDES} />)
    expect(screen.getByTestId('slide')).toHaveTextContent('One')
    expect(screen.getByTestId('slide')).not.toHaveTextContent('Two')
    await user.click(screen.getByTestId('next'))
    expect(screen.getByTestId('slide')).not.toHaveTextContent('One')
  })
})
