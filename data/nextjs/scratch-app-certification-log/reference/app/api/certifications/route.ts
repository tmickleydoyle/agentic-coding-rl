import { getCertifications, addCertification } from "../../../lib/store";
import { Certification } from "../../../lib/types";

export async function GET(_req: Request): Promise<Response> {
  return new Response(JSON.stringify(getCertifications()), { status: 200, headers: { "Content-Type": "application/json" } });
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();
  const { name, provider, status } = body;
  if (!name || !provider || !status) {
    return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
  }
  const cert = addCertification({ name, provider, status: status as Certification["status"] });
  return new Response(JSON.stringify(cert), { status: 201, headers: { "Content-Type": "application/json" } });
}
