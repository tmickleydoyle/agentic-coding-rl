import { describe, it, expect, beforeEach } from "vitest";
import { GET, POST, DELETE } from "../app/api/candidates/route";
import { __reset } from "../lib/store";

beforeEach(() => {
  __reset();
});

describe("Candidates API", () => {
  it("GET returns seed candidates", async () => {
    const res = await GET(new Request("http://localhost/api/candidates"));
    const data = await res.json();
    expect(data.length).toBe(4);
  });

  it("POST creates candidate for open job", async () => {
    const res = await POST(
      new Request("http://localhost/api/candidates", {
        method: "POST",
        body: JSON.stringify({ name: "Eve", email: "eve@test.com", jobId: "1", stage: "Applied" }),
      })
    );
    expect(res.status).toBe(201);
  });

  it("POST rejects candidate for closed job", async () => {
    const res = await POST(
      new Request("http://localhost/api/candidates", {
        method: "POST",
        body: JSON.stringify({ name: "Eve", email: "eve@test.com", jobId: "3", stage: "Applied" }),
      })
    );
    expect(res.status).toBe(400);
  });

  it("DELETE removes candidate", async () => {
    await DELETE(new Request("http://localhost/api/candidates?id=1", { method: "DELETE" }));
    const res = await GET(new Request("http://localhost/api/candidates"));
    const data = await res.json();
    expect(data.length).toBe(3);
  });
});
