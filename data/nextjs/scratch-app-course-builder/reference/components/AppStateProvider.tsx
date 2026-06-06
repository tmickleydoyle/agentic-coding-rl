'use client'
import React, { createContext, useContext, useState } from 'react';
import type { Route, Course, Module, Lesson } from '../lib/types';

interface AppContextValue {
  route: Route;
  navigate: (r: Route) => void;
  course: Course;
  modules: Module[];
  lessons: Lesson[];
  setCourse: (c: Course) => void;
  setModules: (m: Module[]) => void;
  setLessons: (l: Lesson[]) => void;
}

const defaultCourse: Course = { title: 'Introduction to Programming', description: 'Learn the basics of coding', published: false };

const AppContext = createContext<AppContextValue>({
  route: 'home',
  navigate: () => {},
  course: defaultCourse,
  modules: [],
  lessons: [],
  setCourse: () => {},
  setModules: () => {},
  setLessons: () => {},
});

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<Route>('home');
  const [course, setCourse] = useState<Course>(defaultCourse);
  const [modules, setModules] = useState<Module[]>([
    { id: 1, title: 'Getting Started', order: 1, lessonCount: 2 },
    { id: 2, title: 'Variables & Types', order: 2, lessonCount: 1 },
  ]);
  const [lessons, setLessons] = useState<Lesson[]>([
    { id: 1, moduleId: 1, title: 'What is Programming?', type: 'video', duration: 10 },
    { id: 2, moduleId: 1, title: 'Your First Program', type: 'exercise', duration: 20 },
    { id: 3, moduleId: 2, title: 'Understanding Variables', type: 'video', duration: 15 },
  ]);

  return (
    <AppContext.Provider value={{ route, navigate: setRoute, course, modules, lessons, setCourse, setModules, setLessons }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
