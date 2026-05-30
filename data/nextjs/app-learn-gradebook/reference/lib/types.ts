export type Student = {
  id: string
  name: string
}

export type Assignment = {
  id: string
  title: string
}

export type Grades = Record<string, number>

export type Route = 'students' | 'assignments' | 'gradebook' | 'summary'
export type Theme = 'light' | 'dark'
