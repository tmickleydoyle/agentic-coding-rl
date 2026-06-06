import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, DELETE } from "../app/api/networth/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Net Worth API", () => {
  it("GET returns assets", async () => {
    const data = await (await GET(new Request("http://localhost/api/networth"))).json();
    expect(data.data.length).toBe(3);
  });
  it("GET returns liabilities", async () => {
    const data = await (await GET(new Request("http://localhost/api/networth?type=liabilities"))).json();
    expect(data.data.length).toBe(2);
  });
  it("GET returns snapshots", async () => {
    const data = await (await GET(new Request("http://localhost/api/networth?type=snapshots"))).json();
    expect(data.data.length).toBe(1);
  });
  it("POST adds asset", async () => {
    const res = await POST(new Request("http://localhost/api/networth", {
      method: "POST",
      body: JSON.stringify({ id: "a99", name: "Test", value: 1000, category: "cash" }),
    }));
    expect(res.status).toBe(201);
  });
  it("DELETE removes asset", async () => {
    await DELETE(new Request("http://localhost/api/networth?id=a1", { method: "DELETE" }));
    const data = await (await GET(new Request("http://localhost/api/networth"))).json();
    expect(data.data.length).toBe(2);
  });
});
