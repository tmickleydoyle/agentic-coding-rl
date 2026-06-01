export type Employee = {
  id: string
  name: string
  title: string
  department: string
  email: string
  managerId: string | null
}

export type Route = 'directory' | 'profile' | 'departments' | 'org'
export type Theme = 'light' | 'dark'
