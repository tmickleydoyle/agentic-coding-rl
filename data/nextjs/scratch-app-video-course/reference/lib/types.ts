export type Lesson = {
  id: string
  title: string
  duration: number
}

export type Module = {
  id: string
  title: string
  lessons: Lesson[]
}

export type Course = {
  id: string
  title: string
  modules: Module[]
}

export type Route = 'courses' | 'course-detail' | 'player' | 'progress'
export type Theme = 'light' | 'dark'
