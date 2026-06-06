import type { Course, Module, Lesson } from './types';

export let course: Course = { title: 'Introduction to Programming', description: 'Learn the basics of coding', published: false };

export let modules: Module[] = [
  { id: 1, title: 'Getting Started', order: 1, lessonCount: 2 },
  { id: 2, title: 'Variables & Types', order: 2, lessonCount: 1 },
];

export let lessons: Lesson[] = [
  { id: 1, moduleId: 1, title: 'What is Programming?', type: 'video', duration: 10 },
  { id: 2, moduleId: 1, title: 'Your First Program', type: 'exercise', duration: 20 },
  { id: 3, moduleId: 2, title: 'Understanding Variables', type: 'video', duration: 15 },
];

let nextModuleId = 3;
let nextLessonId = 4;

export function addModule(title: string): Module {
  const maxOrder = modules.reduce((m, mod) => Math.max(m, mod.order), 0);
  const mod: Module = { id: nextModuleId++, title, order: maxOrder + 1, lessonCount: 0 };
  modules.push(mod);
  return mod;
}

export function deleteModule(id: number): boolean {
  const idx = modules.findIndex((m) => m.id === id);
  if (idx === -1) return false;
  modules.splice(idx, 1);
  lessons = lessons.filter((l) => l.moduleId !== id);
  return true;
}

export function addLesson(moduleId: number, title: string, type: string, duration: number): Lesson {
  const lesson: Lesson = { id: nextLessonId++, moduleId, title, type, duration };
  lessons.push(lesson);
  const mod = modules.find((m) => m.id === moduleId);
  if (mod) mod.lessonCount++;
  return lesson;
}

export function togglePublish(): Course {
  course = { ...course, published: !course.published };
  return course;
}

export function __reset(): void {
  course = { title: 'Introduction to Programming', description: 'Learn the basics of coding', published: false };
  modules = [
    { id: 1, title: 'Getting Started', order: 1, lessonCount: 2 },
    { id: 2, title: 'Variables & Types', order: 2, lessonCount: 1 },
  ];
  lessons = [
    { id: 1, moduleId: 1, title: 'What is Programming?', type: 'video', duration: 10 },
    { id: 2, moduleId: 1, title: 'Your First Program', type: 'exercise', duration: 20 },
    { id: 3, moduleId: 2, title: 'Understanding Variables', type: 'video', duration: 15 },
  ];
  nextModuleId = 3;
  nextLessonId = 4;
}
