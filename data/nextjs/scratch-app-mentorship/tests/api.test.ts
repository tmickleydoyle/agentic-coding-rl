import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/mentors/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("GET /api/mentors", () => {
  it("returns all mentors", async () => {
    const res = await GET(new Request("http://localhost/api/mentors"));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.length).toBe(3);
  });
});

describe("POST /api/mentors", () => {
  it("creates mentor", async () => {
    const req = new Request("http://localhost/api/mentors", {
      method: "POST",
      body: JSON.stringify({ name: "Test Mentor", specialty: "Tech", email: "t@t.com" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.active).toBe(true);
  });

  it("returns 400 for missing fields", async () => {
    const req = new Request("http://localhost/api/mentors", {
      method: "POST",
      body: JSON.stringify({ name: "Only Name" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
