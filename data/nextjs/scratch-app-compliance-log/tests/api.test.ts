import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/logs/route";
import { __reset } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("GET /api/logs", () => {
  it("returns 3 seed entries", async () => {
    const res = await GET(new Request("http://localhost/api/logs"));
    const data = await res.json();
    expect(data).toHaveLength(3);
  });
});

describe("POST /api/logs", () => {
  it("creates log entry with 201", async () => {
    const req = new Request("http://localhost/api/logs", {
      method: "POST",
      body: JSON.stringify({ title: "New Entry", regulation: "PCI", severity: "Low", status: "Open", date: "2024-04-01", notes: "" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
  });

  it("returns 400 for empty title", async () => {
    const req = new Request("http://localhost/api/logs", {
      method: "POST",
      body: JSON.stringify({ title: "", regulation: "GDPR", severity: "High", status: "Open", date: "", notes: "" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("persists entry after POST", async () => {
    const req = new Request("http://localhost/api/logs", {
      method: "POST",
      body: JSON.stringify({ title: "Test", regulation: "SOX", severity: "Medium", status: "Open", date: "", notes: "" }),
    });
    await POST(req);
    const res = await GET(new Request("http://localhost/api/logs"));
    const data = await res.json();
    expect(data).toHaveLength(4);
  });
});
