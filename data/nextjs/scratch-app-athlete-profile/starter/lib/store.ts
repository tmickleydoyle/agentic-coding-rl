import { AthleteInfo, Metric, AthleteEvent, Achievement } from "./types";

export function __reset(): void {}
export function getAthleteInfo(): AthleteInfo { return { name: "Jordan Smith", sport: "Triathlon", dateOfBirth: "1995-08-20", bio: "Competitive triathlete since 2015" }; }
export function saveAthleteInfo(_info: AthleteInfo): void {}
export function getMetrics(): Metric[] { return []; }
export function addMetric(_date: string, _weight: number, _height: number, _vo2max: number): Metric | null { return null; }
export function getEvents(): AthleteEvent[] { return []; }
export function addEvent(_name: string, _date: string, _result: string, _place: number): AthleteEvent | null { return null; }
export function deleteEvent(_id: string): void {}
export function getAchievements(): Achievement[] { return []; }
export function addAchievement(_title: string, _date: string, _description: string): Achievement { return { id: "", title: _title, date: _date, description: _description }; }
export function deleteAchievement(_id: string): void {}
