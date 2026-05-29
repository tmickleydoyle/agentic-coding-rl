'use client'
import { useState } from 'react'
import NavLink from './NavLink'

export default function Navbar({
  links,
}: {
  links: { href: string; label: string }[]
}) {
  const [active, setActive] = useState(links[0]?.href ?? '')
  return (
    <nav data-testid="nav">
      {links.map((l) => (
        <NavLink
          key={l.href}
          href={l.href}
          label={l.label}
          active={l.href === active}
          onClick={() => setActive(l.href)}
        />
      ))}
      <span data-testid="active">{active}</span>
    </nav>
  )
}
