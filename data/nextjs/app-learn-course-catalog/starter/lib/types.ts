export type Lesson = {
  id: string
  title: string
}

export type Course = {
  id: string
  title: string
  lessons: Lesson[]
}

export type Enrollment = {
  courseId: string
  completedLessonIds: string[]
}

export type Route = 'catalog' | 'course-detail' | 'my-courses' | 'progress'
export type Theme = 'light' | 'dark'
