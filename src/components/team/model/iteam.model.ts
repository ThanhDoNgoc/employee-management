import { Document, Schema } from "mongoose";

export default interface ITeam extends Document {
  name: string;
  leaderId?: Schema.Types.ObjectId;
  members?: Schema.Types.ObjectId[];
  isDeleted?: boolean;
}
