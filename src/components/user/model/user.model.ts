import { model, Schema } from "mongoose";

import IUser from "./iuser.model";
import { status } from "../utils/user.status";
import { role } from "../utils/user.role";
import Password from "../utils/user.password";

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
      type: Schema.Types.ObjectId,
    },
  ],
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

UserSchema.pre("save", async function () {
  if (this.isModified("password")) {
    const hashPassword = await Password.hash(this.get("password"));
    this.set("password", hashPassword);
  }
});

export default model<IUser>("User", UserSchema);
