import mongoose from "mongoose";

export namespace UserTypes {
  export interface DeleteResponse {
    n?: number;
    ok?: number;
    deletedCount?: number;
  }

  export interface User extends mongoose.Document {
    name: String;
    lastName: String;
    email: String;
    phoneNumber: String;
  }
}
