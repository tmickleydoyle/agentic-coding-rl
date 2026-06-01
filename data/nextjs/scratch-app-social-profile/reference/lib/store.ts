import type { Post, Profile } from './types'

// In-memory server store for the API routes. SEPARATE from the client AppStateProvider
// state. Tests call __reset() in beforeEach so each test starts from the same seed.

let profiles: Profile[] = []
let posts: Post[] = []
let nextUserId = 1

function seed(): void {
  profiles = [
    { id: 'u1', name: 'Mia', bio: 'Builder of things' },
    { id: 'u2', name: 'Omar', bio: 'Designer' },
    { id: 'u3', name: 'Zoe', bio: 'Writer' },
    { id: 'u4', name: 'Kai', bio: 'Hacker' },
  ]
  posts = [
    { id: 'p1', authorId: 'u1', text: 'First post' },
    { id: 'p2', authorId: 'u1', text: 'Hello followers' },
    { id: 'p3', authorId: 'u2', text: 'Design tips' },
  ]
  nextUserId = 5
}

seed()

export function __reset(): void {
  seed()
}

export function listUsers(filter?: { q?: string | null }): Profile[] {
  let out = profiles.slice()
  const q = filter?.q
  if (q && q.trim().length > 0) {
    const needle = q.trim().toLowerCase()
    out = out.filter((p) => p.name.toLowerCase().includes(needle))
  }
  return out
}

export function findUser(id: string): Profile | undefined {
  return profiles.find((p) => p.id === id)
}

export function createUser(input: { name: string; bio?: string }): Profile {
  const profile: Profile = {
    id: `u${nextUserId++}`,
    name: input.name,
    bio: input.bio ?? '',
  }
  profiles.push(profile)
  return profile
}

export function updateUser(
  id: string,
  patch: { name?: string; bio?: string },
): Profile | undefined {
  const profile = profiles.find((p) => p.id === id)
  if (!profile) return undefined
  if (typeof patch.name === 'string') profile.name = patch.name
  if (typeof patch.bio === 'string') profile.bio = patch.bio
  return profile
}

export function deleteUser(id: string): boolean {
  const idx = profiles.findIndex((p) => p.id === id)
  if (idx === -1) return false
  profiles.splice(idx, 1)
  return true
}

export function listPosts(authorId?: string): Post[] {
  if (authorId) return posts.filter((p) => p.authorId === authorId)
  return posts.slice()
}
