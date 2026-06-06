import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/skills/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("GET /api/skills", () => {
  it("returns all skills", async () => {
    const res = await GET(new Request("http://localhost/api/skills"));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.length).toBe(3);
  });
});

describe("POST /api/skills", () => {
  it("creates a skill with hoursTotal 0", async () => {
    const req = new Request("http://localhost/api/skills", {
      method: "POST",
      body: JSON.stringify({ name: "Rust", category: "Systems", level: "beginner" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.hoursTotal).toBe(0);
  });

  it("returns 400 for missing fields", async () => {
    const req = new Request("http://localhost/api/skills", {
      method: "POST",
      body: JSON.stringify({ name: "Rust" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
