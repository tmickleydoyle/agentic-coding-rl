import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/stats/route";
import { __reset } from "../lib/store";
beforeEach(() => { __reset(); });
describe("API /api/stats", () => {
  it("GET returns 3 players", async () => {
    const res = GET(new Request("http://localhost/api/stats"));
    const data = await res.json();
    expect(data.length).toBe(3);
  });
  it("POST updates points", async () => {
    const req = new Request("http://localhost/api/stats", {
      method: "POST",
      body: JSON.stringify({ id: 1, totalPoints: 30 }),
    });
    const res = await POST(req);
    const data = await res.json();
    expect(data.totalPoints).toBe(30);
  });
  it("POST 404 for unknown player", async () => {
    const req = new Request("http://localhost/api/stats", {
      method: "POST",
      body: JSON.stringify({ id: 999, totalPoints: 10 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(404);
  });
});
