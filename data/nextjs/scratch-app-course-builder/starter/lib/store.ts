import type { Course, Module, Lesson } from './types';
export let course: Course = { title: 'Introduction to Programming', description: 'Learn the basics of coding', published: false };
export let modules: Module[] = [];
export let lessons: Lesson[] = [];
export function addModule(_title: string): Module { return { id: 0, title: '', order: 0, lessonCount: 0 }; }
export function deleteModule(_id: number): boolean { return false; }
export function addLesson(_m: number, _t: string, _ty: string, _d: number): Lesson { return { id: 0, moduleId: 0, title: '', type: '', duration: 0 }; }
export function togglePublish(): Course { return course; }
export function __reset(): void { modules = []; lessons = []; }
