import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/certifications/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("GET /api/certifications", () => {
  it("returns all certifications", async () => {
    const res = await GET(new Request("http://localhost/api/certifications"));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.length).toBe(3);
  });
});

describe("POST /api/certifications", () => {
  it("creates a certification", async () => {
    const req = new Request("http://localhost/api/certifications", {
      method: "POST",
      body: JSON.stringify({ name: "Azure AZ-900", provider: "Microsoft", status: "planned" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe("Azure AZ-900");
  });

  it("returns 400 for missing fields", async () => {
    const req = new Request("http://localhost/api/certifications", {
      method: "POST",
      body: JSON.stringify({ name: "Incomplete" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
