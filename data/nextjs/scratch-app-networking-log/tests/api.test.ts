import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/events/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("GET /api/events", () => {
  it("returns all events", async () => {
    const res = await GET(new Request("http://localhost/api/events"));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.length).toBe(2);
  });
});

describe("POST /api/events", () => {
  it("creates an event", async () => {
    const req = new Request("http://localhost/api/events", {
      method: "POST",
      body: JSON.stringify({ name: "Test Conf", date: "2024-10-01", location: "LA", type: "conference" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe("Test Conf");
  });

  it("returns 400 for missing fields", async () => {
    const req = new Request("http://localhost/api/events", {
      method: "POST",
      body: JSON.stringify({ name: "Incomplete" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
