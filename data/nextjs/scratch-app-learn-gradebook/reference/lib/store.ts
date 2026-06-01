import type { Assignment, Grades, Student } from './types'
import { seedAssignments, seedGrades, seedStudents } from './seed'
import { gradeKey, studentAverage } from './grades'

// In-memory server store for the API routes. SEPARATE from the client provider state.

let students: Student[] = []
let assignments: Assignment[] = []
let grades: Grades = {}
let nextStudentId = 1
let nextAssignmentId = 1

function seed(): void {
  students = seedStudents()
  assignments = seedAssignments()
  grades = seedGrades()
  nextStudentId = 4
  nextAssignmentId = 3
}

seed()

export function __reset(): void {
  seed()
}

export function listStudents(): Student[] {
  return students.slice()
}

export function findStudent(id: string): Student | undefined {
  return students.find((s) => s.id === id)
}

export function studentAverageById(id: string): number | null {
  const student = students.find((s) => s.id === id)
  if (!student) return null
  return studentAverage(grades, student, assignments)
}

export function createStudent(name: string): Student {
  const student: Student = { id: `s${nextStudentId++}`, name }
  students.push(student)
  return student
}

export function listAssignments(): Assignment[] {
  return assignments.slice()
}

export function findAssignment(id: string): Assignment | undefined {
  return assignments.find((a) => a.id === id)
}

export function createAssignment(title: string): Assignment {
  const assignment: Assignment = { id: `a${nextAssignmentId++}`, title }
  assignments.push(assignment)
  return assignment
}

export function setGrade(studentId: string, assignmentId: string, score: number): { key: string; score: number } {
  const clamped = Math.max(0, Math.min(100, score))
  const key = gradeKey(studentId, assignmentId)
  grades[key] = clamped
  return { key, score: clamped }
}
