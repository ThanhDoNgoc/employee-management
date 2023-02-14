import { status } from "./user.status";
import { role } from "./user.role";

export default interface IUserReturnData {
  username: string;
  name: string;
  status: status;
  role: role;
  teams: string[];
}

export interface IUserDeletedReturnData {
  username: string;
  name: string;
  isDeleted: boolean;
}
