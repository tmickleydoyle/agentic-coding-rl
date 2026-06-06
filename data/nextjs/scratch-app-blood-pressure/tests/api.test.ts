import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, DELETE } from "../app/api/readings/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("GET /api/readings", () => {
  it("returns seeded readings", async () => {
    const res = await GET(new Request("http://localhost/api/readings"));
    const data = await res.json();
    expect(data.readings.length).toBe(3);
  });

  it("returns averages", async () => {
    const res = await GET(new Request("http://localhost/api/readings"));
    const data = await res.json();
    expect(typeof data.averages.systolic).toBe("number");
  });
});

describe("POST /api/readings", () => {
  it("creates a reading with category", async () => {
    const req = new Request("http://localhost/api/readings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: "2024-02-01", time: "08:00", systolic: 120, diastolic: 80, pulse: 70, note: "" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.reading.category).toBeTruthy();
  });

  it("categorizes high-2 correctly", async () => {
    const req = new Request("http://localhost/api/readings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: "2024-02-01", time: "08:00", systolic: 145, diastolic: 95, pulse: 80, note: "" }),
    });
    const res = await POST(req);
    const data = await res.json();
    expect(data.reading.category).toBe("high-2");
  });

  it("returns 400 for missing systolic", async () => {
    const req = new Request("http://localhost/api/readings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: "2024-02-01", time: "08:00", diastolic: 80, pulse: 70, note: "" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe("DELETE /api/readings", () => {
  it("deletes a reading", async () => {
    const res = await DELETE(new Request("http://localhost/api/readings?id=1", { method: "DELETE" }));
    expect(res.status).toBe(200);
  });

  it("returns 404 for missing reading", async () => {
    const res = await DELETE(new Request("http://localhost/api/readings?id=9999", { method: "DELETE" }));
    expect(res.status).toBe(404);
  });
});
