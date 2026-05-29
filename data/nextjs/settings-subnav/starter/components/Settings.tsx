'use client'
import { useState } from 'react'

export default function Settings() {
  // TODO: 3 sub-pages, each with own preserved state (hoist all state into Settings
  // so it survives nav). Active sub-button gets aria-current="page".
  return (
    <div>
      <nav>
        <button data-testid="sub-profile">Profile</button>
        <button data-testid="sub-privacy">Privacy</button>
        <button data-testid="sub-notifications">Notifications</button>
      </nav>
      <section data-testid="section"></section>
    </div>
  )
}
