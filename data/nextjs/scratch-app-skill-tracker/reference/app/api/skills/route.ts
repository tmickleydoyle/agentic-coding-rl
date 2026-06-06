import { getSkills, addSkill } from "../../../lib/store";
import { Skill } from "../../../lib/types";

export async function GET(_req: Request): Promise<Response> {
  return new Response(JSON.stringify(getSkills()), { status: 200, headers: { "Content-Type": "application/json" } });
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { name, category, level } = body;
  if (!name || !category || !level) {
    return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
  }
  const skill = addSkill({ name, category, level: level as Skill["level"] });
  return new Response(JSON.stringify(skill), { status: 201, headers: { "Content-Type": "application/json" } });
}
