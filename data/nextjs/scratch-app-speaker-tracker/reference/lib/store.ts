import { Speaker, TalkRecord, SpeakingEvent } from "./types";

const seedSpeakers: Speaker[] = [
  { id: "sp1", name: "Sarah Chen", expertise: ["AI", "MLOps"], bio: "ML engineer at BigCo", following: true },
  { id: "sp2", name: "Marcus Johnson", expertise: ["Security", "DevOps"], bio: "Security researcher", following: true },
  { id: "sp3", name: "Priya Sharma", expertise: ["Frontend", "React"], bio: "Staff engineer at StartupY", following: false },
];

const seedTalks: TalkRecord[] = [
  { id: "tr1", speakerId: "sp1", title: "Production ML Systems", eventName: "MLConf 2024", watchedDate: "2024-02-10", watched: true, rating: 5, notes: "Excellent content on monitoring" },
  { id: "tr2", speakerId: "sp2", title: "Zero Trust Architecture", eventName: "SecureCon", watchedDate: "", watched: false, rating: 0, notes: "" },
  { id: "tr3", speakerId: "sp1", title: "Feature Store Design", eventName: "DataSummit", watchedDate: "2024-03-05", watched: true, rating: 4, notes: "Good practical advice" },
];

const seedEvents: SpeakingEvent[] = [
  { id: "ev1", speakerId: "sp1", eventName: "AI World 2024", date: "2024-08-20", location: "NYC", rsvped: true },
  { id: "ev2", speakerId: "sp3", eventName: "React Summit", date: "2024-09-15", location: "Amsterdam", rsvped: false },
];

let speakers: Speaker[] = seedSpeakers.map((s) => ({ ...s, expertise: [...s.expertise] }));
let talks: TalkRecord[] = seedTalks.map((t) => ({ ...t }));
let events: SpeakingEvent[] = seedEvents.map((e) => ({ ...e }));
let spC = 4, trC = 4, evC = 3;

export function __reset() {
  speakers = seedSpeakers.map((s) => ({ ...s, expertise: [...s.expertise] }));
  talks = seedTalks.map((t) => ({ ...t }));
  events = seedEvents.map((e) => ({ ...e }));
  spC = 4; trC = 4; evC = 3;
}

export function getSpeakers(): Speaker[] { return speakers; }
export function addSpeaker(data: { name: string; expertise: string[]; bio: string }): Speaker {
  const s: Speaker = { id: `sp${spC++}`, ...data, following: false };
  speakers.push(s);
  return s;
}
export function toggleFollow(id: string): void {
  const s = speakers.find((s) => s.id === id);
  if (s) s.following = !s.following;
}

export function getTalks(): TalkRecord[] { return talks; }
export function markWatched(id: string): void {
  const t = talks.find((t) => t.id === id);
  if (t) { t.watched = true; t.watchedDate = new Date().toISOString().slice(0, 10); }
}
export function setRating(id: string, rating: number): void {
  const t = talks.find((t) => t.id === id);
  if (t) t.rating = rating;
}
export function addTalk(data: { speakerId: string; title: string; eventName: string }): TalkRecord {
  const t: TalkRecord = { id: `tr${trC++}`, ...data, watchedDate: "", watched: false, rating: 0, notes: "" };
  talks.push(t);
  return t;
}

export function getEvents(): SpeakingEvent[] { return events; }
export function toggleRsvp(id: string): void {
  const e = events.find((e) => e.id === id);
  if (e) e.rsvped = !e.rsvped;
}
export function addEvent(data: { speakerId: string; eventName: string; date: string; location: string }): SpeakingEvent {
  const e: SpeakingEvent = { id: `ev${evC++}`, ...data, rsvped: false };
  events.push(e);
  return e;
}
