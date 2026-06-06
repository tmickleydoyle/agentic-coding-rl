import { Campaign, Subscriber, Template } from "./types";

export function __reset() {}
export function getCampaigns(): Campaign[] { return []; }
export function addCampaign(_data: Omit<Campaign, "id" | "createdAt">): Campaign | { error: string } { return { error: "not implemented" }; }
export function deleteCampaign(_id: string): { error?: string } { return {}; }
export function getSubscribers(): Subscriber[] { return []; }
export function addSubscriber(_data: Omit<Subscriber, "id" | "createdAt">): Subscriber | { error: string } { return { error: "not implemented" }; }
export function deactivateSubscriber(_id: string): boolean { return false; }
export function getTemplates(): Template[] { return []; }
export function addTemplate(_data: Omit<Template, "id" | "createdAt">): Template { return { id: "", name: "", subject: "", body: "", createdAt: 0 }; }
export function deleteTemplate(_id: string): { error?: string } { return {}; }
