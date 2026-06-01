import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('pipeline and candidates', () => {
  it('groups candidates by stage with counts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-pipeline'))
    expect(screen.getByTestId('column-applied-count')).toHaveTextContent('1')
    expect(screen.getByTestId('column-interview-count')).toHaveTextContent('1')
    expect(screen.getByTestId('column-offer-count')).toHaveTextContent('1')
    expect(screen.getByTestId('column-hired-count')).toHaveTextContent('1')
    expect(screen.getByTestId('column-screen-count')).toHaveTextContent('0')
  })

  it('places each candidate in the right stage column', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-pipeline'))
    expect(
      within(screen.getByTestId('column-interview')).getByTestId('pipe-candidate-c1'),
    ).toBeInTheDocument()
    expect(
      within(screen.getByTestId('column-applied')).getByTestId('pipe-candidate-c2'),
    ).toBeInTheDocument()
    expect(
      within(screen.getByTestId('column-hired')).getByTestId('pipe-candidate-c4'),
    ).toBeInTheDocument()
  })

  it('advances a candidate to the next stage', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-pipeline'))
    await user.click(screen.getByTestId('advance-c2'))
    expect(
      within(screen.getByTestId('column-screen')).getByTestId('pipe-candidate-c2'),
    ).toBeInTheDocument()
    expect(screen.getByTestId('column-applied-count')).toHaveTextContent('0')
    expect(screen.getByTestId('column-screen-count')).toHaveTextContent('1')
  })

  it('disables advance on a hired candidate', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-pipeline'))
    expect(screen.getByTestId('advance-c4')).toBeDisabled()
  })

  it('advancing from offer reaches hired and disables the button', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-pipeline'))
    await user.click(screen.getByTestId('advance-c3'))
    expect(
      within(screen.getByTestId('column-hired')).getByTestId('pipe-candidate-c3'),
    ).toBeInTheDocument()
    expect(screen.getByTestId('advance-c3')).toBeDisabled()
  })

  it('moves a candidate stage from the candidates page select', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-candidates'))
    await user.selectOptions(screen.getByTestId('stage-c2'), 'interview')
    expect(screen.getByTestId('candidate-c2')).toHaveAttribute('data-stage', 'interview')
  })

  it('candidates page shows the job title per candidate', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-candidates'))
    expect(screen.getByTestId('candidate-c1-job')).toHaveTextContent('Frontend Engineer')
    expect(screen.getByTestId('candidate-c3-job')).toHaveTextContent('Product Designer')
  })

  it('reflects a candidates-page stage change in the pipeline columns', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-candidates'))
    await user.selectOptions(screen.getByTestId('stage-c2'), 'screen')
    await user.click(screen.getByTestId('nav-pipeline'))
    expect(screen.getByTestId('column-screen-count')).toHaveTextContent('1')
    expect(screen.getByTestId('column-applied-count')).toHaveTextContent('0')
  })
})
