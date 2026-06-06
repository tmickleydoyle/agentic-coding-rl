import { Speaker, TalkRecord, SpeakingEvent } from "./types";

export function __reset(): void {}
export function getSpeakers(): Speaker[] { return []; }
export function addSpeaker(_data: { name: string; expertise: string[]; bio: string }): Speaker {
  return { id: "", name: "", expertise: [], bio: "", following: false };
}
export function toggleFollow(_id: string): void {}
export function getTalks(): TalkRecord[] { return []; }
export function markWatched(_id: string): void {}
export function setRating(_id: string, _rating: number): void {}
export function addTalk(_data: { speakerId: string; title: string; eventName: string }): TalkRecord {
  return { id: "", speakerId: "", title: "", eventName: "", watchedDate: "", watched: false, rating: 0, notes: "" };
}
export function getEvents(): SpeakingEvent[] { return []; }
export function toggleRsvp(_id: string): void {}
export function addEvent(_data: { speakerId: string; eventName: string; date: string; location: string }): SpeakingEvent {
  return { id: "", speakerId: "", eventName: "", date: "", location: "", rsvped: false };
}
