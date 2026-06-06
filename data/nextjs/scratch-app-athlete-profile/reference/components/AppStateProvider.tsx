import React, { createContext, useContext, useState } from "react";
import { AthleteInfo, Metric, AthleteEvent, Achievement, Route } from "../lib/types";

interface AppCtx {
  route: Route;
  setRoute: (r: Route) => void;
  athleteInfo: AthleteInfo;
  saveAthleteInfo: (info: AthleteInfo) => void;
  metrics: Metric[];
  addMetric: (date: string, weight: number, height: number, vo2max: number) => void;
  events: AthleteEvent[];
  addEvent: (name: string, date: string, result: string, place: number) => void;
  deleteEvent: (id: string) => void;
  achievements: Achievement[];
  addAchievement: (title: string, date: string, description: string) => void;
  deleteAchievement: (id: string) => void;
}

const DEFAULT_INFO: AthleteInfo = { name: "Jordan Smith", sport: "Triathlon", dateOfBirth: "1995-08-20", bio: "Competitive triathlete since 2015" };

const Ctx = createContext<AppCtx>({
  route: "profile",
  setRoute: () => {},
  athleteInfo: DEFAULT_INFO,
  saveAthleteInfo: () => {},
  metrics: [],
  addMetric: () => {},
  events: [],
  addEvent: () => {},
  deleteEvent: () => {},
  achievements: [],
  addAchievement: () => {},
  deleteAchievement: () => {},
});

export function useApp() { return useContext(Ctx); }

const SEED_METRICS: Metric[] = [
  { id: "m1", date: "2024-01-10", weight: 72.5, height: 178, vo2max: 58 },
  { id: "m2", date: "2024-04-10", weight: 71.0, height: 178, vo2max: 61 },
];
const SEED_EVENTS: AthleteEvent[] = [
  { id: "e1", name: "City Triathlon", date: "2024-06-15", result: "Finished strong", place: 12 },
  { id: "e2", name: "Sprint Duathlon", date: "2024-08-01", result: "Personal best", place: 3 },
];
const SEED_ACHIEVEMENTS: Achievement[] = [
  { id: "ac1", title: "Age Group Podium", date: "2024-08-01", description: "3rd in 25-29 age group" },
];

let uid_m = 3;
let uid_e = 3;
let uid_ac = 2;

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>("profile");
  const [athleteInfo, setAthleteInfo] = useState<AthleteInfo>({ ...DEFAULT_INFO });
  const [metrics, setMetrics] = useState<Metric[]>(SEED_METRICS.map((m) => ({ ...m })));
  const [events, setEvents] = useState<AthleteEvent[]>(SEED_EVENTS.map((e) => ({ ...e })));
  const [achievements, setAchievements] = useState<Achievement[]>(SEED_ACHIEVEMENTS.map((a) => ({ ...a })));

  function saveAthleteInfo(info: AthleteInfo) {
    if (!info.name.trim()) return;
    setAthleteInfo(info);
  }

  function addMetric(date: string, weight: number, height: number, vo2max: number) {
    if (weight <= 0 || height <= 0) return;
    const m: Metric = { id: `m${uid_m++}`, date, weight, height, vo2max };
    setMetrics((prev) => [...prev, m]);
  }

  function addEvent(name: string, date: string, result: string, place: number) {
    if (place < 1) return;
    const e: AthleteEvent = { id: `e${uid_e++}`, name, date, result, place };
    setEvents((prev) => [...prev, e]);
  }

  function deleteEvent(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  function addAchievement(title: string, date: string, description: string) {
    const a: Achievement = { id: `ac${uid_ac++}`, title, date, description };
    setAchievements((prev) => [...prev, a]);
  }

  function deleteAchievement(id: string) {
    setAchievements((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <Ctx.Provider value={{ route, setRoute, athleteInfo, saveAthleteInfo, metrics, addMetric, events, addEvent, deleteEvent, achievements, addAchievement, deleteAchievement }}>
      {children}
    </Ctx.Provider>
  );
}
