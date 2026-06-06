import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/matches/route";
import { __reset } from "../lib/store";
beforeEach(() => { __reset(); });
describe("API /api/matches", () => {
  it("GET returns 2 matches", async () => {
    const res = GET(new Request("http://localhost/api/matches"));
    const data = await res.json();
    expect(data.length).toBe(2);
  });
  it("POST records valid result", async () => {
    const req = new Request("http://localhost/api/matches", {
      method: "POST",
      body: JSON.stringify({ matchId: 1, winnerId: 1 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.winnerId).toBe(1);
  });
  it("POST rejects invalid winner", async () => {
    const req = new Request("http://localhost/api/matches", {
      method: "POST",
      body: JSON.stringify({ matchId: 1, winnerId: 3 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
