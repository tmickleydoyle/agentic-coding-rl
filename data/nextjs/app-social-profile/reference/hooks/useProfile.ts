'use client'
import { useApp } from '../components/AppStateProvider'
import type { Post, Profile } from '../lib/types'

export type ProfileCounts = {
  posts: number
  followers: number
  following: number
}

export function profileById(profiles: Profile[], id: string): Profile | undefined {
  return profiles.find((p) => p.id === id)
}

export function postsBy(posts: Post[], authorId: string): Post[] {
  return posts.filter((p) => p.authorId === authorId)
}

export function useProfile() {
  const { profiles, posts, meId, selectedUserId, following, followers } = useApp()
  const viewedId = selectedUserId ?? meId
  const me = profileById(profiles, meId)
  const viewed = profileById(profiles, viewedId)
  const myPosts = postsBy(posts, viewedId)
  const counts: ProfileCounts = {
    posts: myPosts.length,
    followers: viewedId === meId ? followers.length : 0,
    following: viewedId === meId ? following.length : 0,
  }
  return { me, viewed, viewedId, myPosts, counts }
}
