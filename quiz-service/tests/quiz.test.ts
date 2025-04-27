import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app";
import axios from "axios";

// ✅ Мокаем весь axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Quiz API", () => {
  beforeAll(async () => {
    // await mongoose.connect("mongodb://localhost:27017/quiz-test");
    await mongoose.connect("mongodb://mongo:27017/quiz-test");
  }, 20000);

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  it("должен отдавать страны для квиза", async () => {
    // ❗ Здесь мокаем ответ axios.get
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        features: [
          { properties: { name_ru: "Россия", adm0_a3: "RUS" } },
          { properties: { name_ru: "Франция", adm0_a3: "FRA" } },
        ],
      },
    });

    const res = await request(app).post("/api/quiz/start").send({ count: 2 });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });
});
