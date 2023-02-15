import { role } from "./user.role";
export default interface IAuthReturnData {
  name: string;
  role: role;
  token: string;
}
