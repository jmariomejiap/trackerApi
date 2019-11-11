import { expect } from "chai";
import mongoose from "mongoose";
import request from "supertest";
import server from "../../server";
import Users from "../../models/users";
import Expenses from "../../models/expenses";
import { tokenizeUser } from "../../utils/tokenHelper";
import { ExpensesTypes as T } from "./types/expenses";

interface Internal {
  token: string;
  expenses: T.Expenses[];
  obsoleteToken: string;
}

const internalHelper: Internal = {
  token: "",
  expenses: [],
  obsoleteToken:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZGJhZTIzOWU2YzRiZWNjMDIzMTljMWIiLCJuYW1lIjoiTWFyaW8iLCJsYXN0TmFtZSI6Ik1lamlhIiwiZW1haWwiOiJqbWFyaW9tZWppYXBAZ21haWwuY29tIiwicGhvbmVOdW1iZXIiOiI4MTItMTIzLTI4OTMiLCJpYXQiOjE1NzI1Mjg2OTd9.M_smk4Buh0nTGweVrvOldzg9weBu0BwVyaPmjDSf9K0"
};

describe("expenses resource", () => {
  beforeEach(async () => {
    // clean
    try {
      await Expenses.deleteMany({});
      await Users.deleteMany({});
    } catch (error) {
      console.log("expense error cleaning ", error);
    }

    const dummyUser = await Users.create({
      name: "Simon",
      lastName: "Mejia",
      userName: "simonsito",
      password: "silly",
      email: "simonmejia@gmail.com",
      phoneNumber: "812-123-2893"
    });
    internalHelper.token = tokenizeUser(dummyUser);

    try {
      const dummyExpense:
        | Array<T.Expenses>
        | Array<any> = await Expenses.create([
        {
          userId: dummyUser._id,
          category: "coffee",
          amount: 7.5
        },
        {
          userId: dummyUser._id,
          category: "gas",
          amount: 32
        }
      ]);
      internalHelper.expenses = dummyExpense;
    } catch (error) {
      console.log("expense error beforeEach ", error);
    }
  });

  it("should return error when fetching for expenses without a valid/correct token", async () => {
    const req = await request(server).get("/api/v1/expenses");

    expect(req.status).to.equal(400);
    expect(req.body.result).to.equal("error");
    expect(req.body.message).to.equal("incomplete user information");
    expect(req.body.details).to.have.lengthOf(0);
  });

  it("should return all user expenses ", async () => {
    const res = await request(server)
      .get("/api/v1/expenses")
      .query({})
      .set("x-tracker-token", internalHelper.token);

    const { data, message, result } = res.body;

    expect(res.status).to.equal(200);
    expect(result).to.equal("ok");
    expect(data[0].category).to.equal("coffee");
    expect(data[0].amount).to.equal(7.5);
    expect(data[1].category).to.equal("gas");
    expect(data[1].amount).to.equal(32);
    expect(message).to.equal("");
  });

  it("should add an expense", async () => {
    const res = await request(server)
      .post("/api/v1/expenses")
      .send({
        category: "gas",
        amount: 64
      })
      .set("x-tracker-token", internalHelper.token);

    const { data, message, result } = res.body;

    expect(res.status).to.equal(200);
    expect(result).to.equal("ok");
    expect(data.category).to.equal("gas");
    expect(data.amount).to.equal(64);
    expect(data._id).to.not.have.length(0);
    expect(data.dateCreated).to.not.have.length(0);

    expect(message).to.equal("");
  });

  it("should return an error trying to remove an expense wrong token", async () => {
    const res = await request(server)
      .delete("/api/v1/expenses")
      .send({
        _id: internalHelper.expenses[0]._id
      })
      .set("x-tracker-token", internalHelper.obsoleteToken);

    const { details, message, result } = res.body;

    expect(res.status).to.equal(400);
    expect(result).to.equal("error");
    expect(message).to.equal("internal error");
    expect(details).to.equal("expense not found");
  });

  it("should remove an expense", async () => {
    const res = await request(server)
      .delete("/api/v1/expenses")
      .send({
        _id: internalHelper.expenses[0]._id
      })
      .set("x-tracker-token", internalHelper.token);

    const { data, message, result } = res.body;

    expect(res.status).to.equal(200);
    expect(result).to.equal("ok");
    expect(data).to.equal("");
    expect(message).to.equal("item deleted");
  });
});
