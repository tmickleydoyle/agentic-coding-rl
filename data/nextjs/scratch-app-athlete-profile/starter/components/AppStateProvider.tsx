import React, { createContext, useContext } from "react";
import { AthleteInfo, Metric, AthleteEvent, Achievement, Route } from "../lib/types";

const DEFAULT_INFO: AthleteInfo = { name: "Jordan Smith", sport: "Triathlon", dateOfBirth: "1995-08-20", bio: "Competitive triathlete since 2015" };

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

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return (
    <Ctx.Provider value={{ route: "profile", setRoute: () => {}, athleteInfo: DEFAULT_INFO, saveAthleteInfo: () => {}, metrics: [], addMetric: () => {}, events: [], addEvent: () => {}, deleteEvent: () => {}, achievements: [], addAchievement: () => {}, deleteAchievement: () => {} }}>
      {children}
    </Ctx.Provider>
  );
}
