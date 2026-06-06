import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/speakers/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("GET /api/speakers", () => {
  it("returns all speakers", async () => {
    const res = await GET(new Request("http://localhost/api/speakers"));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.length).toBe(3);
  });
});

describe("POST /api/speakers", () => {
  it("creates speaker with following:false", async () => {
    const req = new Request("http://localhost/api/speakers", {
      method: "POST",
      body: JSON.stringify({ name: "New Speaker", expertise: ["Cloud"], bio: "Cloud architect" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.following).toBe(false);
  });

  it("returns 400 for missing fields", async () => {
    const req = new Request("http://localhost/api/speakers", {
      method: "POST",
      body: JSON.stringify({ name: "Incomplete" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
