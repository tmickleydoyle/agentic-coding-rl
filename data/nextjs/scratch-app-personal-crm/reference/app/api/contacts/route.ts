import { getContacts, addContact } from "../../../lib/store";

export async function GET(_req: Request): Promise<Response> {
  const contacts = getContacts().map((c) => ({
    id: c.id,
    name: c.name,
    company: c.company,
    email: c.email,
    phone: c.phone,
    tags: c.tags,
    createdAt: c.createdAt,
  }));
  return new Response(JSON.stringify(contacts), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { name, company, email, phone, tags } = body;
  if (!name || !company || !email) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
  }
  const contact = addContact({ name, company, email, phone, tags });
  return new Response(JSON.stringify(contact), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
