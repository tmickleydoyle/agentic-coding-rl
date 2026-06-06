import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/events/route";
import { __reset } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("GET /api/events", () => {
  it("returns 4 seed events", async () => {
    const res = await GET(new Request("http://localhost/api/events"));
    const data = await res.json();
    expect(data).toHaveLength(4);
  });
});

describe("POST /api/events", () => {
  it("appends event and returns 201", async () => {
    const req = new Request("http://localhost/api/events", {
      method: "POST",
      body: JSON.stringify({ actor: "dave@example.com", action: "CREATE", resource: "Doc #200", details: "Created" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
  });

  it("returns 400 for missing actor", async () => {
    const req = new Request("http://localhost/api/events", {
      method: "POST",
      body: JSON.stringify({ actor: "", action: "VIEW", resource: "X", details: "" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for missing action", async () => {
    const req = new Request("http://localhost/api/events", {
      method: "POST",
      body: JSON.stringify({ actor: "user@example.com", action: "", resource: "X", details: "" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("persists new event", async () => {
    const req = new Request("http://localhost/api/events", {
      method: "POST",
      body: JSON.stringify({ actor: "user@example.com", action: "OTHER", resource: "X", details: "" }),
    });
    await POST(req);
    const res = await GET(new Request("http://localhost/api/events"));
    const data = await res.json();
    expect(data).toHaveLength(5);
  });
});
