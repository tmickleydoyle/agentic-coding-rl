export interface Game { id: string; title: string; platform: string; genre: string; status: 'not started'|'playing'|'completed'|'dropped' }
export interface Session { id: string; gameId: string; gameTitle: string; date: string; duration: number; notes: string }
export interface Achievement { id: string; gameId: string; gameTitle: string; name: string; description: string; unlockedDate: string }
export type Route = 'home'|'games'|'sessions'|'achievements'
export interface AppState { route: Route; setRoute: (r: Route) => void }
