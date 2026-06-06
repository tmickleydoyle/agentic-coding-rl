import { Subject, Session } from './types';

export function getSubjects(): Subject[] { return []; }
export function addSubject(_name: string, _color: string): Subject { throw new Error('Not implemented'); }
export function deleteSubject(_id: string): void {}
export function getSessions(): Session[] { return []; }
export function addSession(_subjectId: string, _date: string, _durationMinutes: number, _notes: string): Session { throw new Error('Not implemented'); }
export function deleteSession(_id: string): void {}
export function __reset(): void {}
