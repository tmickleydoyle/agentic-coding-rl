'use client'
import React, { createContext, useContext, useState } from 'react';
import type { Route, Course, Module, Lesson } from '../lib/types';
interface AppContextValue { route: Route; navigate: (r: Route) => void; course: Course; modules: Module[]; lessons: Lesson[]; setCourse: (c: Course) => void; setModules: (m: Module[]) => void; setLessons: (l: Lesson[]) => void; }
const defaultCourse: Course = { title: 'Introduction to Programming', description: 'Learn the basics of coding', published: false };
const AppContext = createContext<AppContextValue>({ route: 'home', navigate: () => {}, course: defaultCourse, modules: [], lessons: [], setCourse: () => {}, setModules: () => {}, setLessons: () => {} });
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home');
  const [course] = useState<Course>(defaultCourse);
  const [modules] = useState<Module[]>([]);
  const [lessons] = useState<Lesson[]>([]);
  return <AppContext.Provider value={{ route, navigate: setRoute, course, modules, lessons, setCourse: () => {}, setModules: () => {}, setLessons: () => {} }}>{children}</AppContext.Provider>;
}
export function useApp() { return useContext(AppContext); }
