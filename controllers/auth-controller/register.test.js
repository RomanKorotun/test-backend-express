import mongoose from "mongoose";
import app from "../../app.js";
import "dotenv/config";
import request from "supertest";
import User from "../../models/User.js";

const { TEST_DB_HOST, PORT = 5050 } = process.env;

describe("test api/auth/register", () => {
  let server = null;
  beforeAll(async () => {
    await mongoose.connect(TEST_DB_HOST);
    server = app.listen(PORT);
  });
  afterEach(async () => {
    await User.deleteMany({});
  });
  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });
  test("test 'register' with correct status'", async () => {
    const registerData = {
      username: "Roman",
      email: "roman@gmail.com",
      password: "123456",
    };
    const { statusCode } = await request(app)
      .post("/api/auth/register")
      .send(registerData);
    expect(statusCode).toBe(201);
  });
  test("test 'register' - user with such an email is already in the database - status", async () => {
    const registerData = {
      username: "Roman",
      email: "roman@gmail.com",
      password: "123456",
    };
    await request(app).post("/api/auth/register").send(registerData);
    const { statusCode } = await request(app)
      .post("/api/auth/register")
      .send(registerData);
    expect(statusCode).toBe(409);
  });
});
