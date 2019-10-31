import { expect } from "chai";
import * as jwt from "jsonwebtoken";
import mongoose from "mongoose";
import request from "supertest";
import server from "../../server";
import Users from "../../models/users";
import { tokenizeUser } from "../../utils/tokenHelper";

interface Internal {
  token: string;
  obsoleteToken: string;
  corruptedToken: string;
}

const internalHelper: Internal = {
  token: "",
  obsoleteToken:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZGJhZTIzOWU2YzRiZWNjMDIzMTljMWIiLCJuYW1lIjoiTWFyaW8iLCJsYXN0TmFtZSI6Ik1lamlhIiwiZW1haWwiOiJqbWFyaW9tZWppYXBAZ21haWwuY29tIiwicGhvbmVOdW1iZXIiOiI4MTItMTIzLTI4OTMiLCJpYXQiOjE1NzI1Mjg2OTd9.M_smk4Buh0nTGweVrvOldzg9weBu0BwVyaPmjDSf9K0",
  corruptedToken:
    "ekpXVCJ9.eyJ1NzI1Mjg2OTd9.M_smk4Buh0nTGweVrvOldzg9weBu0BwVyaPmjDSf9K0"
};

describe("users resource", () => {
  const dummyUser = {
    name: "Mario",
    lastName: "Mejia",
    email: "jmariomejiap@gmail.com",
    phoneNumber: "812-123-2893"
  };

  beforeEach(async () => {
    // clean
    try {
      await Users.deleteMany({});
    } catch (error) {
      console.log("users error cleaning  ", error);
    }

    try {
      const userSaved = await Users.create(dummyUser);
      internalHelper.token = tokenizeUser(userSaved);
    } catch (error) {
      console.log("error beforeEach ", error);
    }
  });

  it("should return an users", async () => {
    const req = await request(server)
      .get("/api/v1/users")
      .query({
        token: internalHelper.token
      });

    expect(req.status).to.equal(200);
    expect(req.body.result).to.equal("ok");
    expect(req.body.details).to.have.lengthOf(0);

    expect(req.body.data.name).to.equal("Mario");
    expect(req.body.data.lastName).to.equal("Mejia");
    expect(req.body.data.email).to.equal("jmariomejiap@gmail.com");
    expect(req.body.data.phoneNumber).to.equal("812-123-2893");
  });

  it("should return error with token but invalid user", async () => {
    const req = await request(server)
      .get("/api/v1/users")
      .query({
        token: internalHelper.obsoleteToken
      });

    expect(req.status).to.equal(400);
    expect(req.body.result).to.equal("error");
    expect(req.body.message).to.equal("invalid user");
    expect(req.body.details).to.have.lengthOf(0);
  });

  it("should return a 500 Error if token is incomplete/wrong/corrupted", async () => {
    const req = await request(server)
      .get("/api/v1/users")
      .query({ token: internalHelper.corruptedToken });

    expect(req.status).to.equal(500);
    expect(req.body.result).to.equal("error");
    expect(req.body.message).to.equal("internal error");
    expect(req.body.details).to.equal("JsonWebTokenError");
  });

  it("should return error when creating new user with invalid phone number", async () => {
    const req = await request(server)
      .post("/api/v1/users")
      .send({
        name: "Gabriel",
        lastName: "Galvis",
        email: "gg@gmail.com",
        phoneNumber: "812-1223-1111"
      });

    expect(req.status).to.equal(500);
    expect(req.body.result).to.equal("error");
    expect(req.body.message).to.equal("internal error");
    expect(req.body.details).to.equal("ValidationError");
  });

  it("should return when creating new user with invalid email", async () => {
    const req = await request(server)
      .post("/api/v1/users")
      .send({
        name: "Gabriel",
        lastName: "Galvis",
        email: "gggmail.com",
        phoneNumber: "812-12-1111"
      });

    expect(req.status).to.equal(500);
    expect(req.body.result).to.equal("error");
    expect(req.body.message).to.equal("internal error");
    expect(req.body.details).to.equal("ValidationError");
  });

  it("should create an User", async () => {
    const req = await request(server)
      .post("/api/v1/users")
      .send({
        name: "Gabriel",
        lastName: "Galvis",
        email: "gg@gmail.com",
        phoneNumber: "812-123-1111"
      });

    expect(req.body.result).to.equal("ok");
    expect(req.status).to.equal(201);
    // expect(req.body.data).to.exist;
    expect(req.body.data).to.not.have.lengthOf(0);
  });

  it("should return error creating user when already exist", async () => {
    const req = await request(server)
      .post("/api/v1/users")
      .send(dummyUser);

    expect(req.status).to.equal(500);
    expect(req.body.result).to.equal("error");
    expect(req.body.message).to.equal("internal error");
    expect(req.body.details).to.equal("MongoError");
  });

  it("should return an Error when trying to delete a invalid user", async () => {
    const req = await request(server)
      .delete("/api/v1/users")
      .send({ token: internalHelper.obsoleteToken });

    expect(req.status).to.equal(400);
    expect(req.body.result).to.equal("error");
    expect(req.body.userId).to.equal("");
    expect(req.body.details).to.equal("user doesn't exist");
  });

  it("should delete a user", async () => {
    const req = await request(server)
      .delete("/api/v1/users")
      .send({ token: internalHelper.token });

    expect(req.status).to.equal(201);
    expect(req.body.result).to.equal("ok");
    expect(req.body.userId).to.equal("");
    expect(req.body.details).to.equal("user deleted");
  });
});
