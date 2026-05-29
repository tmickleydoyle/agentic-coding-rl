import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Navbar from '../components/Navbar'

const LINKS = [
  { href: '/home', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
]

describe('Navbar', () => {
  it('renders one button per link with correct labels', () => {
    render(<Navbar links={LINKS} />)
    expect(screen.getByTestId('link-/home')).toHaveTextContent('Home')
    expect(screen.getByTestId('link-/about')).toHaveTextContent('About')
    expect(screen.getByTestId('link-/blog')).toHaveTextContent('Blog')
  })

  it('first link is active initially', () => {
    render(<Navbar links={LINKS} />)
    expect(screen.getByTestId('active')).toHaveTextContent('/home')
    expect(screen.getByTestId('link-/home')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('link-/about')).not.toHaveAttribute('aria-current')
  })

  it('clicking a link makes it active', async () => {
    const user = userEvent.setup()
    render(<Navbar links={LINKS} />)
    await user.click(screen.getByTestId('link-/blog'))
    expect(screen.getByTestId('active')).toHaveTextContent('/blog')
    expect(screen.getByTestId('link-/blog')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('link-/home')).not.toHaveAttribute('aria-current')
  })
})
