import { Game, Session, Achievement } from './types'
let games: Game[] = [
  { id: 'g1', title: 'The Legend of Zelda', platform: 'Nintendo Switch', genre: 'Action-Adventure', status: 'playing' },
  { id: 'g2', title: 'Elden Ring', platform: 'PC', genre: 'RPG', status: 'completed' },
  { id: 'g3', title: 'Minecraft', platform: 'PC', genre: 'Sandbox', status: 'not started' },
]
let sessions: Session[] = [
  { id: 's1', gameId: 'g1', gameTitle: 'The Legend of Zelda', date: '2024-06-01', duration: 2.5, notes: 'Explored Hyrule' },
  { id: 's2', gameId: 'g2', gameTitle: 'Elden Ring', date: '2024-05-20', duration: 3, notes: 'Beat final boss' },
]
let achievements: Achievement[] = [
  { id: 'a1', gameId: 'g2', gameTitle: 'Elden Ring', name: 'Elden Lord', description: 'Complete the main story', unlockedDate: '2024-05-20' },
  { id: 'a2', gameId: 'g1', gameTitle: 'The Legend of Zelda', name: 'First Shrine', description: 'Complete first shrine', unlockedDate: '2024-06-01' },
]
let nextId = 100
function uid() { return String(++nextId) }
export function getGames() { return [...games] }
export function addGame(d: Omit<Game,'id'>): Game { const g = { id: uid(), ...d }; games.push(g); return g }
export function deleteGame(id: string): boolean { const l = games.length; games = games.filter(g => g.id !== id); return games.length < l }
export function getSessions() { return [...sessions] }
export function addSession(d: Omit<Session,'id'>): Session { const s = { id: uid(), ...d }; sessions.push(s); return s }
export function getAchievements() { return [...achievements] }
export function addAchievement(d: Omit<Achievement,'id'>): Achievement { const a = { id: uid(), ...d }; achievements.push(a); return a }
export function __reset() {
  games = [
    { id: 'g1', title: 'The Legend of Zelda', platform: 'Nintendo Switch', genre: 'Action-Adventure', status: 'playing' },
    { id: 'g2', title: 'Elden Ring', platform: 'PC', genre: 'RPG', status: 'completed' },
    { id: 'g3', title: 'Minecraft', platform: 'PC', genre: 'Sandbox', status: 'not started' },
  ]
  sessions = [
    { id: 's1', gameId: 'g1', gameTitle: 'The Legend of Zelda', date: '2024-06-01', duration: 2.5, notes: 'Explored Hyrule' },
    { id: 's2', gameId: 'g2', gameTitle: 'Elden Ring', date: '2024-05-20', duration: 3, notes: 'Beat final boss' },
  ]
  achievements = [
    { id: 'a1', gameId: 'g2', gameTitle: 'Elden Ring', name: 'Elden Lord', description: 'Complete the main story', unlockedDate: '2024-05-20' },
    { id: 'a2', gameId: 'g1', gameTitle: 'The Legend of Zelda', name: 'First Shrine', description: 'Complete first shrine', unlockedDate: '2024-06-01' },
  ]
  nextId = 100
}
