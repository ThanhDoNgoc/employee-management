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
  _id: string;
  name: string;
  username: string;
  status: status;
  role: role;
}

export interface IUserTeamsReturnData {
  teamname: string;
  leaderid: string;
  leadername: string | null;
  members: IMembersInSameTeamReturnData[];
}
export interface IUserDetailReturnData {
  _id: Schema.Types.ObjectId;
  username: string;
  name: string;
  status: status;
  role: role;
  teams: string[];
}
