import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, DELETE, PUT } from "../app/api/steps/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("GET /api/steps", () => {
  it("returns seeded entries", async () => {
    const res = await GET(new Request("http://localhost/api/steps"));
    const data = await res.json();
    expect(data.entries.length).toBe(3);
  });

  it("returns goal", async () => {
    const res = await GET(new Request("http://localhost/api/steps"));
    const data = await res.json();
    expect(data.goal.dailyTarget).toBe(10000);
  });

  it("returns stats", async () => {
    const res = await GET(new Request("http://localhost/api/steps"));
    const data = await res.json();
    expect(typeof data.stats.totalSteps).toBe("number");
  });
});

describe("POST /api/steps", () => {
  it("creates entry with computed distance and calories", async () => {
    const req = new Request("http://localhost/api/steps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: "2024-02-01", steps: 10000, notes: "" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.entry.distanceKm).toBe(8);
    expect(data.entry.caloriesBurned).toBe(400);
    expect(data.entry.goalMet).toBe(true);
  });

  it("sets goalMet false when below target", async () => {
    const req = new Request("http://localhost/api/steps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: "2024-02-02", steps: 5000, notes: "" }),
    });
    const res = await POST(req);
    const data = await res.json();
    expect(data.entry.goalMet).toBe(false);
  });

  it("returns 400 for missing date", async () => {
    const req = new Request("http://localhost/api/steps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ steps: 5000, notes: "" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe("DELETE /api/steps", () => {
  it("deletes an entry", async () => {
    const res = await DELETE(new Request("http://localhost/api/steps?id=1", { method: "DELETE" }));
    expect(res.status).toBe(200);
  });

  it("returns 404 for missing entry", async () => {
    const res = await DELETE(new Request("http://localhost/api/steps?id=9999", { method: "DELETE" }));
    expect(res.status).toBe(404);
  });
});

describe("PUT /api/steps (update goal)", () => {
  it("updates goal", async () => {
    const req = new Request("http://localhost/api/steps", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dailyTarget: 8000 }),
    });
    const res = await PUT(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.goal.dailyTarget).toBe(8000);
  });
});
