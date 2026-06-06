import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST } from "../app/api/notes/route";
import { __reset } from "../lib/store";
beforeEach(() => { __reset(); });
describe("API /api/notes", () => {
  it("GET returns 3 flags", async () => {
    const res = GET(new Request("http://localhost/api/notes"));
    const data = await res.json();
    expect(data.length).toBe(3);
  });
  it("POST adds a flag", async () => {
    const req = new Request("http://localhost/api/notes", {
      method: "POST",
      body: JSON.stringify({ matchId: 1, minute: 45, type: "offside", note: "Close call" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.type).toBe("offside");
  });
  it("POST rejects invalid minute", async () => {
    const req = new Request("http://localhost/api/notes", {
      method: "POST",
      body: JSON.stringify({ matchId: 1, minute: 95, type: "foul", note: "" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
