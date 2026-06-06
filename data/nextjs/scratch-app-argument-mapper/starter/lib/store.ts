import { Argument, ArgumentType } from "./types";

export function getArguments(): Argument[] { return []; }
export function getArgumentById(_id: string): Argument | undefined { return undefined; }
export function addArgument(_data: Omit<Argument, "id" | "createdAt">): Argument {
  return { id: "", text: "", type: "claim", parentId: null, topic: "", createdAt: "" };
}
export function updateArgument(_id: string, _data: Partial<Omit<Argument, "id" | "createdAt">>): Argument | undefined { return undefined; }
export function deleteArgument(_id: string): boolean { return false; }
export function getByType(_type: ArgumentType): Argument[] { return []; }
export function getByTopic(_topic: string): Argument[] { return []; }
export function getTopics(): string[] { return []; }
export function __reset(): void {}
