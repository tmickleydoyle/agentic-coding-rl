import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/water/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("GET /api/water", () => {
  it("returns 4 seed entries", async () => {
    const res = await GET(new Request("http://localhost/api/water"));
    const data = await res.json();
    expect(data.entries.length).toBe(4);
  });

  it("returns goal of 8", async () => {
    const res = await GET(new Request("http://localhost/api/water"));
    const data = await res.json();
    expect(data.goal).toBe(8);
  });
});

describe("POST /api/water", () => {
  it("creates entry with status 201", async () => {
    const req = new Request("http://localhost/api/water", {
      method: "POST",
      body: JSON.stringify({ date: "2024-05-20", cups: 1.5, note: "Gym", time: "12:00" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.cups).toBe(1.5);
  });

  it("increments entry count", async () => {
    const req = new Request("http://localhost/api/water", {
      method: "POST",
      body: JSON.stringify({ date: "2024-05-20", cups: 1, note: "", time: "10:00" }),
    });
    await POST(req);
    const res = await GET(new Request("http://localhost/api/water"));
    const data = await res.json();
    expect(data.entries.length).toBe(5);
  });
});
