export interface Task {
  id: string; title: string; room: string; dueDate: string; priority: 'low'|'medium'|'high'; status: 'pending'|'completed'; completedDate?: string
}
export type Route = 'home'|'tasks'|'history'|'rooms'
export interface AppState { route: Route; setRoute: (r: Route) => void }
