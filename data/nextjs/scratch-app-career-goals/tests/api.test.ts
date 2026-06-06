import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/goals/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("GET /api/goals", () => {
  it("returns all data", async () => {
    const res = await GET(new Request("http://localhost/api/goals"));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.milestones.length).toBe(3);
    expect(data.applications.length).toBe(3);
    expect(data.skills.length).toBe(3);
  });
});

describe("POST /api/goals", () => {
  it("creates a milestone", async () => {
    const req = new Request("http://localhost/api/goals", {
      method: "POST",
      body: JSON.stringify({ type: "milestone", data: { title: "Test", targetDate: "2024-12-01", category: "skill" } }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
  });

  it("returns 400 for unknown type", async () => {
    const req = new Request("http://localhost/api/goals", {
      method: "POST",
      body: JSON.stringify({ type: "unknown", data: {} }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
