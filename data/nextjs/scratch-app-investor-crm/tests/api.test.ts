import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, DELETE } from "../app/api/investors/route";
import { __reset } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("Investors API", () => {
  it("GET returns seed investors", async () => {
    const res = await GET(new Request("http://localhost/api/investors"));
    const data = await res.json();
    expect(data.length).toBe(4);
  });

  it("POST creates investor", async () => {
    const res = await POST(
      new Request("http://localhost/api/investors", {
        method: "POST",
        body: JSON.stringify({ name: "Eve", firm: "Tiger", email: "eve@tiger.com", stage: "Lead" }),
      })
    );
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe("Eve");
  });

  it("POST rejects invalid email", async () => {
    const res = await POST(
      new Request("http://localhost/api/investors", {
        method: "POST",
        body: JSON.stringify({ name: "Eve", firm: "Tiger", email: "notvalid", stage: "Lead" }),
      })
    );
    expect(res.status).toBe(400);
  });

  it("DELETE removes investor", async () => {
    await DELETE(new Request("http://localhost/api/investors?id=1", { method: "DELETE" }));
    const res = await GET(new Request("http://localhost/api/investors"));
    const data = await res.json();
    expect(data.length).toBe(3);
  });
});
