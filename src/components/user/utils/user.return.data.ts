import { status } from "./user.status";
import { role } from "./user.role";
import { Schema } from "mongoose";

export default interface IUserReturnData {
  _id: Schema.Types.ObjectId;
  username: string;
  name: string;
  status: status;
  role: role;
  teams: Schema.Types.ObjectId[];
}

export interface IUserDeletedReturnData {
  username: string;
  name: string;
  isDeleted: boolean;
}

export interface IMembersInSameTeamReturnData {
  name: string;
  status: status;
  role: role;
}

export interface IUserTeamsReturnData {
  teamname: string;
  leadername: string | null;
  members: IMembersInSameTeamReturnData[];
}
