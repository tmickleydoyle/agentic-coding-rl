import { getMilestones, getApplications, getSkills, addMilestone, addApplication, addSkill } from "../../../lib/store";
import { Milestone, CareerSkill } from "../../../lib/types";

export async function GET(_req: Request): Promise<Response> {
  const data = { milestones: getMilestones(), applications: getApplications(), skills: getSkills() };
  return new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json" } });
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { type, data } = body;
  if (!type || !data) return new Response(JSON.stringify({ error: "Missing type or data" }), { status: 400 });

  if (type === "milestone") {
    const m = addMilestone({ title: data.title, description: data.description ?? "", targetDate: data.targetDate, category: data.category as Milestone["category"] });
    return new Response(JSON.stringify(m), { status: 201, headers: { "Content-Type": "application/json" } });
  }
  if (type === "application") {
    const a = addApplication({ company: data.company, role: data.role, notes: data.notes ?? "" });
    return new Response(JSON.stringify(a), { status: 201, headers: { "Content-Type": "application/json" } });
  }
  if (type === "skill") {
    const s = addSkill({ name: data.name, proficiency: data.proficiency as CareerSkill["proficiency"], required: data.required ?? false });
    return new Response(JSON.stringify(s), { status: 201, headers: { "Content-Type": "application/json" } });
  }
  return new Response(JSON.stringify({ error: "Unknown type" }), { status: 400 });
}
