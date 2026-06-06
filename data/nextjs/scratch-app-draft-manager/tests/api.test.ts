import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/picks/route";
import { __reset } from "../lib/store";
beforeEach(() => { __reset(); });
describe("API /api/picks", () => {
  it("GET returns empty initially", async () => {
    const res = GET(new Request("http://localhost/api/picks"));
    const data = await res.json();
    expect(data.length).toBe(0);
  });
  it("POST makes a pick", async () => {
    const req = new Request("http://localhost/api/picks", {
      method: "POST",
      body: JSON.stringify({ teamId: 1, playerId: 1 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.teamId).toBe(1);
  });
  it("POST rejects duplicate", async () => {
    const make = () => new Request("http://localhost/api/picks", {
      method: "POST",
      body: JSON.stringify({ teamId: 1, playerId: 1 }),
    });
    await POST(make());
    const res = await POST(make());
    expect(res.status).toBe(400);
  });
});
