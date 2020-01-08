import * as mongoose from "mongoose";

const expensesSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  dateCreated: { type: Date, default: Date.now }
});

export default mongoose.model("Expenses", expensesSchema);
