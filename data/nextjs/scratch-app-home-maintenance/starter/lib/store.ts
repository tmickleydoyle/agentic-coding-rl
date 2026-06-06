import { Task } from './types'
export function getTasks(): Task[] { return [] }
export function addTask(_d: Omit<Task,'id'>): Task { return { id:'',title:'',room:'',dueDate:'',priority:'medium',status:'pending' } }
export function completeTask(_id: string, _date: string): boolean { return false }
export function deleteTask(_id: string): boolean { return false }
export function __reset() {}
