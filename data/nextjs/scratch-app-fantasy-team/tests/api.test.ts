import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/roster/route";
import { __reset } from "../lib/store";
beforeEach(() => { __reset(); });
describe("API /api/roster", () => {
  it("GET returns 3 roster players", async () => {
    const res = GET(new Request("http://localhost/api/roster"));
    const data = await res.json();
    expect(data.length).toBe(3);
  });
  it("POST adds waiver player to roster", async () => {
    const req = new Request("http://localhost/api/roster", {
      method: "POST",
      body: JSON.stringify({ playerId: 4 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.onRoster).toBe(true);
  });
  it("POST rejects already-rostered player", async () => {
    const req = new Request("http://localhost/api/roster", {
      method: "POST",
      body: JSON.stringify({ playerId: 1 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
