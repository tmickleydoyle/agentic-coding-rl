'use client'
import { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { useProfile } from '../../hooks/useProfile'

export default function EditPage() {
  const { meId, updateProfile, navigate } = useApp()
  const { me } = useProfile()
  const [name, setName] = useState(me?.name ?? '')
  const [bio, setBio] = useState(me?.bio ?? '')
  const [error, setError] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim().length === 0) {
      setError('Name is required')
      return
    }
    setError('')
    updateProfile(meId, { name: name.trim(), bio })
    navigate('profile')
  }

  return (
    <section data-testid="page-edit">
      <h1>Edit profile</h1>
      <form data-testid="edit-form" onSubmit={onSubmit}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          data-testid="name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="bio">Bio</label>
        <input
          id="bio"
          data-testid="bio-input"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        {error ? <p data-testid="edit-error">{error}</p> : null}

        <button type="submit" data-testid="save-profile">
          Save
        </button>
      </form>
    </section>
  )
}
