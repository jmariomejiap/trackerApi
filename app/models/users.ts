import * as mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import { UserTypes as T } from "../modules/users/types/users";

const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  userName: {
    type: String,
    unique: true,
    index: {
      unique: true
    }
  },
  password: { type: String, required: true },
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

UserSchema.pre("save", function(next) {
  const user = this as T.User;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, (err: Error, salt) => {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, (err: Error, hash: String) => {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = async function validatePassword(
  incomingPassword: String
) {
  return await bcrypt.compare(incomingPassword, this.password);
};

export default mongoose.model<T.User>("Users", UserSchema);
