import { model, Schema } from "mongoose";

import IUser from "./iuser.model";
import { status } from "../utils/user.status";
import { role } from "../utils/user.role";

const UserSchema: Schema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: role,
    default: role.member,
  },
  status: {
    type: String,
    enum: status,
    default: status.available,
  },
  teams: [
    {
      type: String,
    },
  ],
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const User = model("User", UserSchema);
export default User;
