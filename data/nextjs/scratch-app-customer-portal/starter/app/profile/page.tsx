'use client'
import React from 'react'

export function ProfilePage() {
  return (
    <div>
      <h1>My Profile</h1>
      <form data-testid="profile-form">
        <input data-testid="input-profile-name" placeholder="Name" />
        <input data-testid="input-profile-email" placeholder="Email" />
        <input data-testid="input-profile-phone" placeholder="Phone" />
        <input data-testid="input-profile-address" placeholder="Address" />
        <button data-testid="btn-save-profile" type="submit">Save Profile</button>
      </form>
    </div>
  )
}
