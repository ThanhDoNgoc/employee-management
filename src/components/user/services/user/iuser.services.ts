import { Schema } from "mongoose";
import IUser, { IUserUpdate } from "../../model/iuser.model";
import IUserReturnData from "../../utils/user.return.data";
import { IUserDeletedReturnData } from "../../utils/user.return.data";

export default interface IUserServices {
  returnUserData(user: IUser): IUserReturnData;
  create(user: IUser): Promise<IUserReturnData>;
  updateById(_id: string, user: IUserUpdate): Promise<IUserReturnData>;
  getAll(): Promise<IUserReturnData[]>;
  getById(_id: string): Promise<IUser>;
  getByManyId(_ids: Schema.Types.ObjectId[]): Promise<IUserReturnData[]>;
  delete(_id: string): Promise<IUserDeletedReturnData>;
  addTeam(user: IUser, teamId: Schema.Types.ObjectId): Promise<IUserReturnData>;
}
