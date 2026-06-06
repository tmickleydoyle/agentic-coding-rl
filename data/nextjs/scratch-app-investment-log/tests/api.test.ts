import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, DELETE } from "../app/api/investments/route";
import { __reset } from "../lib/store";

beforeEach(() => { __reset(); });

describe("Investments API", () => {
  it("GET returns holdings", async () => {
    const req = new Request("http://localhost/api/investments");
    const data = await (await GET(req)).json();
    expect(data.data.length).toBe(3);
  });
  it("GET returns transactions", async () => {
    const req = new Request("http://localhost/api/investments?type=transactions");
    const data = await (await GET(req)).json();
    expect(data.data.length).toBe(3);
  });
  it("POST adds holding", async () => {
    const req = new Request("http://localhost/api/investments", {
      method: "POST",
      body: JSON.stringify({ id: "h99", ticker: "TEST", shares: 1, avgPrice: 100, currentPrice: 110 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
  });
  it("DELETE removes holding", async () => {
    const req = new Request("http://localhost/api/investments?id=h1", { method: "DELETE" });
    await DELETE(req);
    const data = await (await GET(new Request("http://localhost/api/investments"))).json();
    expect(data.data.length).toBe(2);
  });
});
