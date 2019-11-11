import mongoose from "mongoose";

export namespace UserTypes {
  export interface DeleteResponse {
    n?: number;
    ok?: number;
    deletedCount?: number;
  }

  export interface ErrorResponse {
    result: String;
    message: String;
    details: String;
  }

  export interface CreateUserResponse {
    result: String;
    data: String;
  }

  type comparePasswordFunction = (newPassword: string) => Boolean;

  export interface User extends mongoose.Document {
    name: String;
    lastName: String;
    userName: String;
    password: String;
    email: String;
    phoneNumber: String;
    comparePassword: comparePasswordFunction;
  }

  export interface UserDataResponse {
    name: String;
    lastName: String;
    userName: String;
    email: String;
    phoneNumber: String;
  }
}
