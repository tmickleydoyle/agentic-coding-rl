import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/conferences/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("GET /api/conferences", () => {
  it("returns all conferences", async () => {
    const res = await GET(new Request("http://localhost/api/conferences"));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.length).toBe(2);
  });
});

describe("POST /api/conferences", () => {
  it("creates conference with attended:false", async () => {
    const req = new Request("http://localhost/api/conferences", {
      method: "POST",
      body: JSON.stringify({ name: "Test Conf", date: "2024-10-01", location: "LA" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.attended).toBe(false);
  });

  it("returns 400 for missing fields", async () => {
    const req = new Request("http://localhost/api/conferences", {
      method: "POST",
      body: JSON.stringify({ name: "Incomplete" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
