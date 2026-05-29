'use client'
import { useState } from 'react'
import NavLink from './NavLink'

// TODO: track which href is active (initially links[0].href). Render <nav data-testid="nav">
// containing one NavLink per link, and <span data-testid="active">{activeHref}</span>.
export default function Navbar({
  links,
}: {
  links: { href: string; label: string }[]
}) {
  return <nav data-testid="nav" />
}
