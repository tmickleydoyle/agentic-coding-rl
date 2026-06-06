import { Argument, ArgumentType } from "./types";

let args: Argument[] = [];
let nextId = 1;

export function getArguments(): Argument[] { return args; }

export function getArgumentById(id: string): Argument | undefined {
  return args.find((a) => a.id === id);
}

export function addArgument(data: Omit<Argument, "id" | "createdAt">): Argument {
  const a: Argument = { ...data, id: String(nextId++), createdAt: new Date().toISOString() };
  args.push(a);
  return a;
}

export function updateArgument(id: string, data: Partial<Omit<Argument, "id" | "createdAt">>): Argument | undefined {
  const idx = args.findIndex((a) => a.id === id);
  if (idx === -1) return undefined;
  args[idx] = { ...args[idx], ...data };
  return args[idx];
}

export function deleteArgument(id: string): boolean {
  const idx = args.findIndex((a) => a.id === id);
  if (idx === -1) return false;
  args.splice(idx, 1);
  return true;
}

export function getByType(type: ArgumentType): Argument[] {
  return args.filter((a) => a.type === type);
}

export function getByTopic(topic: string): Argument[] {
  return args.filter((a) => a.topic.toLowerCase() === topic.toLowerCase());
}

export function getTopics(): string[] {
  const s = new Set<string>();
  args.forEach((a) => { if (a.topic) s.add(a.topic); });
  return Array.from(s).sort();
}

export function __reset(): void {
  args = [];
  nextId = 1;
}
