import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/risks/route";
import { __reset } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("GET /api/risks", () => {
  it("returns 3 seed risks", async () => {
    const res = await GET(new Request("http://localhost/api/risks"));
    const data = await res.json();
    expect(data).toHaveLength(3);
  });
});

describe("POST /api/risks", () => {
  it("creates risk and returns 201", async () => {
    const req = new Request("http://localhost/api/risks", {
      method: "POST",
      body: JSON.stringify({ title: "New Risk", category: "Financial", likelihood: 2, impact: 3, status: "Open", owner: "Finance", description: "" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.title).toBe("New Risk");
  });

  it("returns 400 for empty title", async () => {
    const req = new Request("http://localhost/api/risks", {
      method: "POST",
      body: JSON.stringify({ title: "", category: "Other", likelihood: 1, impact: 1, status: "Open", owner: "", description: "" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("persists new risk", async () => {
    const req = new Request("http://localhost/api/risks", {
      method: "POST",
      body: JSON.stringify({ title: "Test", category: "Other", likelihood: 1, impact: 1, status: "Open", owner: "", description: "" }),
    });
    await POST(req);
    const res = await GET(new Request("http://localhost/api/risks"));
    const data = await res.json();
    expect(data).toHaveLength(4);
  });
});
