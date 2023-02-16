import { Schema } from "mongoose";
import IUser, { IUserUpdate } from "../../model/iuser.model";
import IUserReturnData from "../../utils/user.return.data";
import { IUserDeletedReturnData } from "../../utils/user.return.data";
import { role } from "../../utils/user.role";
import { status } from "../../utils/user.status";

export default interface IUserServices {
  returnUserData(user: IUser): IUserReturnData;
  create(user: IUser): Promise<IUserReturnData>;
  updateById(_id: string, user: IUserUpdate): Promise<IUserReturnData>;
  getAll(): Promise<IUserReturnData[]>;
  getById(_id: string | Schema.Types.ObjectId): Promise<IUser>;
  getByManyId(_ids: Schema.Types.ObjectId[]): Promise<IUserReturnData[]>;
  getByRole(role: role): Promise<IUserReturnData[]>;
  delete(_id: string): Promise<IUserDeletedReturnData>;
  addTeam(user: IUser, teamId: Schema.Types.ObjectId): Promise<IUserReturnData>;
  updateStatusById(
    _id: string | Schema.Types.ObjectId,
    status: status
  ): Promise<IUserReturnData>;
  removeTeam(
    user: IUser,
    teamId: Schema.Types.ObjectId
  ): Promise<IUserReturnData>;
  removeTeamInManyUsers(
    _ids: Schema.Types.ObjectId[],
    teamId: Schema.Types.ObjectId
  );
}
