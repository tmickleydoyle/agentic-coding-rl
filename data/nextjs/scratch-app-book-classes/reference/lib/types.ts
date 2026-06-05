export type Klass = {
  id: string
  name: string
  capacity: number
}

export type EnrollStatus = 'enrolled' | 'waitlisted'

export type Enrollment = {
  id: string
  classId: string
  student: string
  status: EnrollStatus
}

export type Route = 'classes' | 'class-detail' | 'my-classes' | 'waitlist'
export type Theme = 'light' | 'dark'
