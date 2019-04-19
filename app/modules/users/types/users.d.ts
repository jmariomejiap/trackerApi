export namespace UserTypes {
  export interface DeleteResponse {
    n?: number;
    ok?: number;
    deletedCount?: number;
  }

  export interface NewUser {
    name: String;
    lastName: String;
    email: String;
    phoneNumber: String;
  }
}
