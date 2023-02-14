import jwt from "jsonwebtoken";
import { injectable } from "inversify";

import IAuthReturnData from "../../utils/auth.return.data";
import IAuthServices from "./iauth.services";
import IUser from "../../model/iuser.model";
import User from "../../model/user.model";
import Password from "../../utils/user.password";

@injectable()
export default class AuthServices implements IAuthServices {
  async login(
    username: string,
    inputPassword: string
  ): Promise<IAuthReturnData> {
    const user: IUser = await User.findOne({ username: username });
    if (
      !user ||
      !(await Password.comparePassword(user.password, inputPassword))
    ) {
      return;
    }

    const token = jwt.sign(
      {
        _id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE_TIME,
      }
    );

    const authReturnData: IAuthReturnData = {
      name: user.name,
      token: token,
    };

    return authReturnData;
  }

  async register(register: IUser) {
    const user = new User(register);
    return await user.save();
  }
}
