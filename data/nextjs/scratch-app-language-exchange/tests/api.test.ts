import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, DELETE } from "../app/api/sessions/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Sessions API", () => {
  it("GET returns sessions", async () => {
    const res = await GET();
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  it("POST creates a session", async () => {
    const req = new Request("http://localhost/api/sessions", {
      method: "POST",
      body: JSON.stringify({ partnerId: "p1", partnerName: "Maria", language: "Spanish", date: "2024-04-01", durationMinutes: 45, notes: "Good session" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.durationMinutes).toBe(45);
  });

  it("POST rejects missing fields", async () => {
    const req = new Request("http://localhost/api/sessions", {
      method: "POST",
      body: JSON.stringify({ partnerId: "p1" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("DELETE removes a session", async () => {
    const req = new Request("http://localhost/api/sessions?id=s1", { method: "DELETE" });
    const res = await DELETE(req);
    expect(res.status).toBe(200);
    const check = await GET();
    const data = await check.json();
    expect(data.find((s: { id: string }) => s.id === "s1")).toBeUndefined();
  });

  it("DELETE returns 404 for unknown id", async () => {
    const req = new Request("http://localhost/api/sessions?id=unknown", { method: "DELETE" });
    const res = await DELETE(req);
    expect(res.status).toBe(404);
  });
});
