import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/supplements/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("GET /api/supplements", () => {
  it("returns 4 seed supplements", async () => {
    const res = await GET(new Request("http://localhost/api/supplements"));
    const data = await res.json();
    expect(data.supplements.length).toBe(4);
  });

  it("returns 2 today logs", async () => {
    const res = await GET(new Request("http://localhost/api/supplements"));
    const data = await res.json();
    expect(data.todayLogs.length).toBe(2);
  });
});

describe("POST /api/supplements", () => {
  it("creates supplement with status 201", async () => {
    const req = new Request("http://localhost/api/supplements", {
      method: "POST",
      body: JSON.stringify({ name: "B12", dosage: "500mcg", frequency: "daily", notes: "" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe("B12");
  });

  it("increments supplement count", async () => {
    const req = new Request("http://localhost/api/supplements", {
      method: "POST",
      body: JSON.stringify({ name: "Iron", dosage: "18mg", frequency: "daily", notes: "" }),
    });
    await POST(req);
    const res = await GET(new Request("http://localhost/api/supplements"));
    const data = await res.json();
    expect(data.supplements.length).toBe(5);
  });
});
