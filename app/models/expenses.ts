import * as mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  caterogy: {
    type: String,
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  dateCreated: { type: Date, default: Date.now }
});

export default mongoose.model("Users", userSchema);
