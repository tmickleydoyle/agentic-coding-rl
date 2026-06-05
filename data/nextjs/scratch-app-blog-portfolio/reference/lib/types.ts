export type Project = {
  id: string
  title: string
  tags: string[]
  featured: boolean
}

export type Post = {
  id: string
  title: string
  tag: string
}

export type Route = 'home' | 'projects' | 'writing' | 'project-detail'
export type Theme = 'light' | 'dark'
