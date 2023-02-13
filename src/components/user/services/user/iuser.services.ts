import IUser, { IUserUpdate } from "../../model/iuser.model";

export default interface IUserServices {
  create(user: IUser);
  updateById(_id: string, user: IUserUpdate);
  getAll();
  getById(_id: string);
  delete(_id: string);
}
