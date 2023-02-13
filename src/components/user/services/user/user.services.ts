import { injectable } from "inversify";
import IUser from "../../model/iuser.model";
import User from "../../model/user.model";

import IUserServices from "./iuser.services";

@injectable()
export default class UserServices implements IUserServices {
  async create(user: IUser) {
    const newUser = new User(user);
    return await newUser.save();
  }

  async updateById(_id: string, user: IUser) {
    return await User.findByIdAndUpdate(_id, user).then((user: IUser) => {
      return user;
    });
  }
  async getAll() {
    return await User.find({ isDeleted: false });
  }
  async getById(_id: string) {
    return await User.findById(_id);
  }
  async delete(_id: string) {
    return await User.findByIdAndUpdate(_id, { isDeleted: true }).then(
      (user: IUser) => {
        return user;
      }
    );
  }
}
