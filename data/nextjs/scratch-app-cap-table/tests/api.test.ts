import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, DELETE } from "../app/api/shareholders/route";
import { __reset } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("Shareholders API", () => {
  it("GET returns seed shareholders", async () => {
    const res = await GET(new Request("http://localhost/api/shareholders"));
    const data = await res.json();
    expect(data.length).toBe(4);
  });

  it("POST creates shareholder", async () => {
    const res = await POST(
      new Request("http://localhost/api/shareholders", {
        method: "POST",
        body: JSON.stringify({ name: "New Emp", type: "Employee", shares: 50000 }),
      })
    );
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe("New Emp");
  });

  it("POST rejects zero shares", async () => {
    const res = await POST(
      new Request("http://localhost/api/shareholders", {
        method: "POST",
        body: JSON.stringify({ name: "Bad", type: "Employee", shares: 0 }),
      })
    );
    expect(res.status).toBe(400);
  });

  it("DELETE removes shareholder", async () => {
    await DELETE(new Request("http://localhost/api/shareholders?id=1", { method: "DELETE" }));
    const res = await GET(new Request("http://localhost/api/shareholders"));
    const data = await res.json();
    expect(data.length).toBe(3);
  });
});
