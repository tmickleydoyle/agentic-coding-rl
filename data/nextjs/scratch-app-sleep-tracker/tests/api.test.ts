import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, DELETE } from "../app/api/sleep/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("GET /api/sleep", () => {
  it("returns seeded entries", async () => {
    const res = await GET(new Request("http://localhost/api/sleep"));
    const data = await res.json();
    expect(data.entries.length).toBe(3);
  });

  it("returns insights", async () => {
    const res = await GET(new Request("http://localhost/api/sleep"));
    const data = await res.json();
    expect(typeof data.insights.avgDuration).toBe("number");
  });
});

describe("POST /api/sleep", () => {
  it("creates a sleep entry with computed duration", async () => {
    const req = new Request("http://localhost/api/sleep", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: "2024-02-01", bedtime: "22:00", wakeTime: "06:00", quality: 4, notes: "" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.entry.durationHours).toBe(8);
  });

  it("handles overnight sleep (crosses midnight)", async () => {
    const req = new Request("http://localhost/api/sleep", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: "2024-02-02", bedtime: "23:00", wakeTime: "07:00", quality: 3, notes: "" }),
    });
    const res = await POST(req);
    const data = await res.json();
    expect(data.entry.durationHours).toBe(8);
  });

  it("returns 400 if date missing", async () => {
    const req = new Request("http://localhost/api/sleep", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bedtime: "22:00", wakeTime: "06:00", quality: 4, notes: "" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe("DELETE /api/sleep", () => {
  it("deletes an entry", async () => {
    const res = await DELETE(new Request("http://localhost/api/sleep?id=1", { method: "DELETE" }));
    expect(res.status).toBe(200);
  });

  it("returns 404 for missing entry", async () => {
    const res = await DELETE(new Request("http://localhost/api/sleep?id=9999", { method: "DELETE" }));
    expect(res.status).toBe(404);
  });
});
