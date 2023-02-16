import { Schema } from "mongoose";

export default interface ITeamReturnData {
  _id: Schema.Types.ObjectId;
  name: string;
  leaderId: Schema.Types.ObjectId | null;
  members: Schema.Types.ObjectId[];
}

export interface ITeamsReturnData {
  _id?: Schema.Types.ObjectId;
  name: string;
  leader: IMember | null;
}

export interface ITeamDetailReturnData {
  _id?: Schema.Types.ObjectId;
  name: string;
  leader: IMember | null;
  members: IMember[];
}

export interface IMember {
  _id?: Schema.Types.ObjectId;
  name: string;
  username: string;
}
