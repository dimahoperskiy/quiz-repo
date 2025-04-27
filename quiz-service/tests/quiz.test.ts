import request from "supertest";
import mongoose from "mongoose";
import nock from "nock";
import app from "../src/app";
import { config } from "../src/config";

describe("Quiz API", () => {
  beforeAll(async () => {
    // Устанавливаем правильный GEO_SERVICE_URL для тестов
    process.env.GEO_SERVICE_URL = "http://geo-service:3001/api";

    await mongoose.connect("mongodb://mongo:27017/quiz-test");
  }, 20000);

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  it("должен отдавать страны для квиза", async () => {
    // Мокаем ответ от geo-service
    nock(config.geoServiceUrl.replace("/api", ""))
      .get("/countries")
      .reply(200, {
        features: [
          { properties: { name_ru: "Россия", adm0_a3: "RUS" } },
          { properties: { name_ru: "Франция", adm0_a3: "FRA" } },
        ],
      });

    const res = await request(app).post("/api/quiz/start").send({ count: 2 });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });
});
