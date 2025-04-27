import request from "supertest";
import app from "../src/app";

describe("Geo API", () => {
  it("должен отдавать список стран", async () => {
    const res = await request(app).get("/api/countries").expect(200);

    expect(Array.isArray(res.body.features)).toBe(true);
    expect(res.body.features.length).toBeGreaterThan(0);
  });
});
