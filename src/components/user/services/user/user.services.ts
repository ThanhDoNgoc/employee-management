import { injectable } from "inversify";
import IUser from "../../model/iuser.model";
import User from "../../model/user.model";

import IUserServices from "./iuser.services";
import IUserReturnData from "../../utils/user.return.data";
import { IUserDeletedReturnData } from "../../utils/user.return.data";
import { Schema } from "mongoose";
import { status } from "../../utils/user.status";
import { role } from "../../utils/user.role";

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
  async getById(_id: string | Schema.Types.ObjectId): Promise<IUser> {
    return await User.findById(_id);
  }
  async getByManyId(_ids: Schema.Types.ObjectId[]): Promise<IUserReturnData[]> {
    const users = await User.find({ _id: { $in: _ids } });
    return users.map((user) => this.returnUserData(user));
  }
  async getByRole(role: role): Promise<IUserReturnData[]> {
    const users = await User.find({
      role: role,
      isDeleted: false,
      status: status.available,
    });
    return users.map((user) => this.returnUserData(user));
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
  async updateStatusById(
    _id: string | Schema.Types.ObjectId,
    status: status
  ): Promise<IUserReturnData> {
    const updatedUser = await User.findByIdAndUpdate(_id, { status: status });
    return this.returnUserData(updatedUser);
  }

  async removeTeam(
    user: IUser,
    teamId: Schema.Types.ObjectId
  ): Promise<IUserReturnData> {
    const teamIndex = user.teams.indexOf(teamId);
    user.teams.splice(teamIndex, 1);
    await user.save();
    return this.returnUserData(user);
  }

  async removeTeamInManyUsers(
    _ids: Schema.Types.ObjectId[],
    teamId: Schema.Types.ObjectId
  ) {
    const users = await User.find({ _id: { $in: _ids } });
    await users.forEach(async (users) => {
      await this.removeTeam(users, teamId);
    });
  }
}
