import IAuthReturnData from "../../utils/auth.return.data";
import IUser from "../../model/iuser.model";

export default interface IAuthServices {
  login(username: string, inputPassword: string): Promise<IAuthReturnData>;
  register(user: IUser);
}
