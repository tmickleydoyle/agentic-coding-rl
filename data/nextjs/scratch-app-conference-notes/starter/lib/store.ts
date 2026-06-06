import { Conference, Talk, Speaker } from "./types";

export function __reset(): void {}
export function getConferences(): Conference[] { return []; }
export function addConference(_data: { name: string; date: string; location: string }): Conference {
  return { id: "", name: "", date: "", location: "", attended: false };
}
export function deleteConference(_id: string): void {}
export function toggleAttended(_id: string): void {}
export function getSpeakers(): Speaker[] { return []; }
export function addSpeaker(_data: { name: string; bio: string; twitter: string }): Speaker {
  return { id: "", name: "", bio: "", twitter: "" };
}
export function getTalks(): Talk[] { return []; }
export function addTalk(_data: { conferenceId: string; speakerId: string; title: string; notes: string; rating: number; tags: string[] }): Talk {
  return { id: "", conferenceId: "", speakerId: "", title: "", notes: "", tags: [], rating: 0 };
}
