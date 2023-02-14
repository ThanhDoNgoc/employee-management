import { injectable } from "inversify";
import IUser from "../../model/iuser.model";
import User from "../../model/user.model";

import IUserServices from "./iuser.services";
import IUserReturnData from "../../utils/user.return.data";
import { IUserDeletedReturnData } from "../../utils/user.return.data";
import { Schema } from "mongoose";

@injectable()
export default class UserServices implements IUserServices {
  returnUserData(user: IUser): IUserReturnData {
    return {
      _id: user._id,
      username: user.username,
      name: user.name,
      role: user.role,
      status: user.status,
      teams: user.teams,
    };
  }

  async create(user: IUser): Promise<IUserReturnData> {
    const newUser = new User(user);
    const createdUser = await newUser.save();
    return this.returnUserData(createdUser);
  }

  async updateById(_id: string, user: IUser): Promise<IUserReturnData> {
    const updatedUser = await User.findByIdAndUpdate(_id, user);
    return this.returnUserData(updatedUser);
  }
  async getAll(): Promise<IUserReturnData[]> {
    const allUser = await User.find({ isDeleted: false });
    return allUser.map((user) => this.returnUserData(user));
  }
  async getById(_id: string): Promise<IUser> {
    return await User.findById(_id);
  }
  async delete(_id: string): Promise<IUserDeletedReturnData> {
    return await User.findByIdAndUpdate(_id, { isDeleted: true }).then(
      (user: IUser) => {
        const returnDeletedUser: IUserDeletedReturnData = {
          username: user.username,
          name: user.name,
          isDeleted: true,
        };
        return returnDeletedUser;
      }
    );
  }
  async addTeam(
    user: IUser,
    teamId: Schema.Types.ObjectId
  ): Promise<IUserReturnData> {
    user.teams.push(teamId);
    await user.save();
    return this.returnUserData(user);
  }
}
