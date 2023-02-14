import { Schema } from "mongoose";

export default interface ITeamReturnData {
  _id: Schema.Types.ObjectId;
  name: string;
  leaderId: Schema.Types.ObjectId | null;
  members: Schema.Types.ObjectId[];
}
