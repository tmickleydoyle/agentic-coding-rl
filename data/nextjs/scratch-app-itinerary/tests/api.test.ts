import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/activities/route";
import { __reset } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("GET /api/activities", () => {
  it("returns 5 seed activities", async () => {
    const res = GET();
    const data = await res.json();
    expect(data.length).toBe(5);
  });
});

describe("POST /api/activities", () => {
  it("creates activity with 201", async () => {
    const req = new Request("http://localhost/api/activities", {
      method: "POST",
      body: JSON.stringify({ day: 4, time: "11:00", title: "Arashiyama Bamboo", location: "Kyoto", category: "Sightseeing", duration: 90, notes: "", cost: 0 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.title).toBe("Arashiyama Bamboo");
  });

  it("count grows after POST", async () => {
    const req = new Request("http://localhost/api/activities", {
      method: "POST",
      body: JSON.stringify({ day: 4, time: "11:00", title: "Arashiyama Bamboo", location: "Kyoto", category: "Sightseeing", duration: 90, notes: "", cost: 0 }),
    });
    await POST(req);
    const res = GET();
    const data = await res.json();
    expect(data.length).toBe(6);
  });
});
