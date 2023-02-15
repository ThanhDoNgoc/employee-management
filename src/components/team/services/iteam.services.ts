import ITeam from "../model/iteam.model";
import ITeamReturnData from "../utils/team.return.data";
import { Schema } from "mongoose";

export default interface ITeamServices {
  returnTeamData(team: ITeam): ITeamReturnData;
  create(name: string): Promise<ITeamReturnData>;
  updateById(_id: string, team: ITeam): Promise<ITeamReturnData>;
  getAll(): Promise<ITeamReturnData[]>;
  getById(_id: string): Promise<ITeam | null>;
  getByName(name: string): Promise<ITeamReturnData | null>;
  getByManyId(_ids: Schema.Types.ObjectId[]): Promise<ITeamReturnData[]>;

  removeLeader(team: ITeam): Promise<ITeamReturnData>;
  removeMember(
    team: ITeam,
    memberId: Schema.Types.ObjectId
  ): Promise<ITeamReturnData>;

  addLeader(
    team: ITeam,
    leaderId: Schema.Types.ObjectId
  ): Promise<ITeamReturnData>;

  addMember(
    team: ITeam,
    memberId: Schema.Types.ObjectId
  ): Promise<ITeamReturnData>;

  delete(team: ITeam);

  removeMemberInManyTeams(
    _ids: Schema.Types.ObjectId[],
    userId: Schema.Types.ObjectId
  );
}
