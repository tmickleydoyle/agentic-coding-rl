import { Game, Session, Achievement } from './types'
export function getGames(): Game[] { return [] }
export function addGame(_d: Omit<Game,'id'>): Game { return { id:'',title:'',platform:'',genre:'',status:'not started' } }
export function deleteGame(_id: string): boolean { return false }
export function getSessions(): Session[] { return [] }
export function addSession(_d: Omit<Session,'id'>): Session { return { id:'',gameId:'',gameTitle:'',date:'',duration:0,notes:'' } }
export function getAchievements(): Achievement[] { return [] }
export function addAchievement(_d: Omit<Achievement,'id'>): Achievement { return { id:'',gameId:'',gameTitle:'',name:'',description:'',unlockedDate:'' } }
export function __reset() {}
