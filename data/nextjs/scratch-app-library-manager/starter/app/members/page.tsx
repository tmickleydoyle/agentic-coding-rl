'use client'
import React from 'react'

export function MembersPage() {
  return (
    <div>
      <h1>Members</h1>
      <form data-testid="add-member-form">
        <input data-testid="input-member-name" placeholder="Name" />
        <input data-testid="input-member-email" placeholder="Email" />
        <input data-testid="input-member-id" placeholder="Membership ID" />
        <button data-testid="btn-add-member" type="submit">Add Member</button>
      </form>
      <ul data-testid="member-list"></ul>
    </div>
  )
}
