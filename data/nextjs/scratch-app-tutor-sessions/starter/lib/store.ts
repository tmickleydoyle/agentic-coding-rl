import type { Tutor, Session, SessionStatus } from './types';
export let tutors: Tutor[] = [];
export let sessions: Session[] = [];
export function bookSession(_tId: number, _sName: string, _date: string, _time: string, _dur: number): Session | null { return null; }
export function updateSessionStatus(_id: number, _status: SessionStatus): Session | null { return null; }
export function __reset(): void { tutors = []; sessions = []; }
