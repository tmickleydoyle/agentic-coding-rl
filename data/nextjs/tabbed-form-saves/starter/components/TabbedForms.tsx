'use client'
import { useState } from 'react'

export default function TabbedForms() {
  // TODO: hoist name/email/bio + status-general/contact/bio into one component so
  // switching tabs preserves all of it. Each Save updates only its own status.
  return (
    <div>
      <nav>
        <button data-testid="tab-general">General</button>
        <button data-testid="tab-contact">Contact</button>
        <button data-testid="tab-bio">Bio</button>
      </nav>
      <section></section>
    </div>
  )
}
