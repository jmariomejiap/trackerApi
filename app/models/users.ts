import * as mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  email: {
    required: [true, "Email is required or invalid"],
    type: String,
    unique: true,
    validate: {
      validator: (email: string): boolean => validator.isEmail(email)
    }
  },
  phoneNumber: {
    required: [true, "User phone number required or invalid"],
    type: String,
    validate: {
      validator: (v: string): boolean => /\d{3}-\d{3}-\d{4}/.test(v)
    }
  },
  dateCreated: { type: Date, default: Date.now }
});

export default mongoose.model("Users", userSchema);
