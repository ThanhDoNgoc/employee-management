import mongoose, { Document, Schema } from "mongoose";
import IUser from "../../user/model/iuser.model";


export default interface ITeam extends Document {
  name: string;
  leaderId?: Schema.Types.ObjectId;
  members?: Schema.Types.ObjectId[];
  isDeleted?: boolean;
}
