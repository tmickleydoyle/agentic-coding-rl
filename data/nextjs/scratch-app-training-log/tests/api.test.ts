import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/logs/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("API /api/logs", () => {
  it("GET returns seed logs", async () => {
    const res = GET(new Request("http://localhost/api/logs"));
    const data = await res.json();
    expect(data.length).toBe(2);
    expect(data[0].sets).toBe(3);
  });

  it("POST adds a log entry", async () => {
    const req = new Request("http://localhost/api/logs", {
      method: "POST",
      body: JSON.stringify({ exerciseId: 1, date: "2024-03-01", sets: 3, reps: 12, weightKg: 85 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.sets).toBe(3);
  });

  it("POST rejects invalid sets", async () => {
    const req = new Request("http://localhost/api/logs", {
      method: "POST",
      body: JSON.stringify({ exerciseId: 1, date: "2024-03-01", sets: 0, reps: 12, weightKg: 85 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("POST rejects negative weight", async () => {
    const req = new Request("http://localhost/api/logs", {
      method: "POST",
      body: JSON.stringify({ exerciseId: 1, date: "2024-03-01", sets: 3, reps: 12, weightKg: -1 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
