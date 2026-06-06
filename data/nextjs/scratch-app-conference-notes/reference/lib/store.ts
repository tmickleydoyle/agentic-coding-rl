import { Conference, Talk, Speaker } from "./types";

const seedConferences: Conference[] = [
  { id: "conf1", name: "ReactConf 2024", date: "2024-05-15", location: "Las Vegas", attended: true },
  { id: "conf2", name: "Node Summit", date: "2024-07-10", location: "San Francisco", attended: false },
];

const seedSpeakers: Speaker[] = [
  { id: "sp1", name: "Dan Abramov", bio: "React core team", twitter: "@dan_abramov" },
  { id: "sp2", name: "Evan You", bio: "Creator of Vue.js", twitter: "@youyuxi" },
  { id: "sp3", name: "Ryan Dahl", bio: "Creator of Node.js and Deno", twitter: "@rough_sea" },
];

const seedTalks: Talk[] = [
  { id: "t1", conferenceId: "conf1", speakerId: "sp1", title: "React Server Components Deep Dive", notes: "Key insight: streaming", tags: ["react", "server"], rating: 5 },
  { id: "t2", conferenceId: "conf1", speakerId: "sp2", title: "Vite 5 Performance", notes: "New bundler improvements", tags: ["vite", "performance"], rating: 4 },
  { id: "t3", conferenceId: "conf2", speakerId: "sp3", title: "Deno 2.0 Updates", notes: "Node compat layer ready", tags: ["deno", "node"], rating: 4 },
];

let conferences: Conference[] = seedConferences.map((c) => ({ ...c }));
let speakers: Speaker[] = seedSpeakers.map((s) => ({ ...s }));
let talks: Talk[] = seedTalks.map((t) => ({ ...t, tags: [...t.tags] }));
let cC = 3, spC = 4, tC = 4;

export function __reset() {
  conferences = seedConferences.map((c) => ({ ...c }));
  speakers = seedSpeakers.map((s) => ({ ...s }));
  talks = seedTalks.map((t) => ({ ...t, tags: [...t.tags] }));
  cC = 3; spC = 4; tC = 4;
}

export function getConferences(): Conference[] { return conferences; }
export function addConference(data: { name: string; date: string; location: string }): Conference {
  const c: Conference = { id: `conf${cC++}`, ...data, attended: false };
  conferences.push(c);
  return c;
}
export function deleteConference(id: string): void {
  conferences = conferences.filter((c) => c.id !== id);
  talks = talks.filter((t) => t.conferenceId !== id);
}
export function toggleAttended(id: string): void {
  const c = conferences.find((c) => c.id === id);
  if (c) c.attended = !c.attended;
}

export function getSpeakers(): Speaker[] { return speakers; }
export function addSpeaker(data: { name: string; bio: string; twitter: string }): Speaker {
  const s: Speaker = { id: `sp${spC++}`, ...data };
  speakers.push(s);
  return s;
}

export function getTalks(): Talk[] { return talks; }
export function addTalk(data: { conferenceId: string; speakerId: string; title: string; notes: string; rating: number; tags: string[] }): Talk {
  const t: Talk = { id: `t${tC++}`, ...data };
  talks.push(t);
  return t;
}
