export type Scope = 'read' | 'write' | 'admin'

export type ApiKey = {
  id: string
  name: string
  secret: string
  scopes: Scope[]
  active: boolean
  usageCount: number
}

export type StatusFilter = 'all' | 'active' | 'revoked'

export type Route = 'keys' | 'create-key' | 'key-detail' | 'usage'
export type Theme = 'light' | 'dark'
