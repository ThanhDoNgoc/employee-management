import { Document, Schema } from "mongoose";
import { role } from "../utils/user.role";
import { status } from "../utils/user.status";

export default interface IUser extends Document {
  username: string;
  password: string;
  name: string;
  role?: role;
  status?: status;
  teams?: Schema.Types.ObjectId[];
  isDeleted?: boolean;
}

export interface IUserUpdate {
  name?: string;
  role?: role;
  status?: status;
}
