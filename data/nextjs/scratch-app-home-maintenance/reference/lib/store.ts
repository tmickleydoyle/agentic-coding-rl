import { Task } from './types'
let tasks: Task[] = [
  { id: 't1', title: 'Replace HVAC filter', room: 'Kitchen', dueDate: '2024-06-01', priority: 'high', status: 'pending' },
  { id: 't2', title: 'Clean gutters', room: 'Exterior', dueDate: '2024-05-15', priority: 'medium', status: 'completed', completedDate: '2024-05-14' },
  { id: 't3', title: 'Fix leaky faucet', room: 'Bathroom', dueDate: '2024-06-20', priority: 'high', status: 'pending' },
  { id: 't4', title: 'Paint walls', room: 'Living Room', dueDate: '2024-07-01', priority: 'low', status: 'pending' },
]
let nextId = 100
function uid() { return String(++nextId) }
export function getTasks() { return [...tasks] }
export function addTask(d: Omit<Task,'id'>): Task { const t = { id: uid(), ...d }; tasks.push(t); return t }
export function completeTask(id: string, completedDate: string): boolean {
  const t = tasks.find(x => x.id === id)
  if (!t) return false
  t.status = 'completed'; t.completedDate = completedDate; return true
}
export function deleteTask(id: string): boolean { const l = tasks.length; tasks = tasks.filter(t => t.id !== id); return tasks.length < l }
export function __reset() {
  tasks = [
    { id: 't1', title: 'Replace HVAC filter', room: 'Kitchen', dueDate: '2024-06-01', priority: 'high', status: 'pending' },
    { id: 't2', title: 'Clean gutters', room: 'Exterior', dueDate: '2024-05-15', priority: 'medium', status: 'completed', completedDate: '2024-05-14' },
    { id: 't3', title: 'Fix leaky faucet', room: 'Bathroom', dueDate: '2024-06-20', priority: 'high', status: 'pending' },
    { id: 't4', title: 'Paint walls', room: 'Living Room', dueDate: '2024-07-01', priority: 'low', status: 'pending' },
  ]
  nextId = 100
}
