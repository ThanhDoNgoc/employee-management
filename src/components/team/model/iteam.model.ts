import { Document, Schema } from "mongoose";

export default interface ITeam extends Document {
  name: string;
  leaderId: Schema.Types.ObjectId | null;
  members: Schema.Types.ObjectId[];
  isDeleted: boolean;
}

export interface ITeamCreate {
  name: string;
  leaderId?: Schema.Types.ObjectId;
}
