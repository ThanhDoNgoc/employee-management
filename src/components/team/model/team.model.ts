import { model, Schema } from "mongoose";
import ITeam from "./iteam.model";

const TeamSchema: Schema = new Schema<ITeam>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  leaderId: {
    type: Schema.Types.ObjectId,
  },
  members: [
    {
      type: Schema.Types.ObjectId,
    },
  ],
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
});

export default model<ITeam>("Team", TeamSchema);
