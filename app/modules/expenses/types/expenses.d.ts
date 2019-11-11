import mongoose from "mongoose";

export namespace ExpensesTypes {
  export interface Expenses extends mongoose.Document {
    userId: String;
    category: String;
    amount: Number;
    dateCreated: Date;
  }

  export interface ExpensePayload {
    catergory: String;
    amount: Number;
  }
}
