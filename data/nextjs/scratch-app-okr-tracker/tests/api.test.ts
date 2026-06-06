import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, PUT, DELETE } from "../app/api/items/route";
import { __reset } from "../lib/store";

beforeEach(() => __reset());

describe("OKR Tracker API", () => {
  it("GET returns empty list", async () => {
    const res = await GET(new Request("http://localhost/api/items"));
    const d = await res.json();
    expect(d.objectives).toEqual([]);
  });

  it("POST creates objective", async () => {
    const res = await POST(new Request("http://localhost/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Grow Revenue", description: "2x revenue", quarter: "Q1 2024", status: "on_track", keyResults: [] }),
    }));
    expect(res.status).toBe(201);
    const d = await res.json();
    expect(d.objective.title).toBe("Grow Revenue");
    expect(d.objective.keyResults).toHaveLength(0);
  });

  it("POST rejects missing title", async () => {
    const res = await POST(new Request("http://localhost/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quarter: "Q1" }),
    }));
    expect(res.status).toBe(400);
  });

  it("PUT adds key result to objective", async () => {
    await POST(new Request("http://localhost/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "O1", description: "", quarter: "Q1", status: "on_track", keyResults: [] }),
    }));
    const res = await PUT(new Request("http://localhost/api/items?id=1&action=addkr", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Reach 100 users", target: 100, current: 0, unit: "users" }),
    }));
    const d = await res.json();
    expect(d.objective.keyResults).toHaveLength(1);
    expect(d.objective.keyResults[0].title).toBe("Reach 100 users");
  });

  it("GET summary returns progress stats", async () => {
    await POST(new Request("http://localhost/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "O1", description: "", quarter: "Q1", status: "on_track", keyResults: [] }),
    }));
    await POST(new Request("http://localhost/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "O2", description: "", quarter: "Q1", status: "completed", keyResults: [] }),
    }));
    const res = await GET(new Request("http://localhost/api/items?summary=1"));
    const d = await res.json();
    expect(d.summary.total).toBe(2);
    expect(d.summary.byStatus.on_track).toBe(1);
    expect(d.summary.byStatus.completed).toBe(1);
  });

  it("DELETE removes objective", async () => {
    await POST(new Request("http://localhost/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Del", description: "", quarter: "", status: "behind", keyResults: [] }),
    }));
    await DELETE(new Request("http://localhost/api/items?id=1", { method: "DELETE" }));
    const res = await GET(new Request("http://localhost/api/items"));
    const d = await res.json();
    expect(d.objectives).toHaveLength(0);
  });
});
