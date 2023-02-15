import ITeam from "../model/iteam.model";
import ITeamServices from "./iteam.services";
import Team from "../model/team.model";
import { Schema } from "mongoose";
import ITeamReturnData from "../utils/team.return.data";
import { injectable } from "inversify";

@injectable()
export default class TeamServices implements ITeamServices {
  returnTeamData(team: ITeam): ITeamReturnData {
    return {
      _id: team._id,
      name: team.name,
      leaderId: team.leaderId,
      members: team.members,
    };
  }

  public async create(name: string): Promise<ITeamReturnData> {
    const newTeam = new Team();
    newTeam.name = name;
    const createdTeam = await newTeam.save();
    return this.returnTeamData(createdTeam);
  }

  public async updateById(_id: string, team: ITeam): Promise<ITeamReturnData> {
    return await Team.findByIdAndUpdate(_id, team).then((team: ITeam) => {
      return this.returnTeamData(team);
    });
  }

  public async getAll(): Promise<ITeamReturnData[]> {
    const allTeams = await Team.find({ isDeleted: false });
    return allTeams.map((team) => this.returnTeamData(team));
  }

  public async getById(_id: string): Promise<ITeam | null> {
    return await Team.findById(_id);
  }

  public async getByManyId(
    _ids: Schema.Types.ObjectId[]
  ): Promise<ITeamReturnData[]> {
    const teams = await Team.find({ _id: { $in: _ids } });
    return teams.map((team) => this.returnTeamData(team));
  }

  public async getByName(name: string): Promise<ITeamReturnData | null> {
    const team = await Team.findOne({ name: name });
    if (!team) return null;
    return this.returnTeamData(team);
  }

  public async delete(team: ITeam) {
    team.isDeleted = true;
    team.leaderId = null;
    team.members = [];
    await team.save();
    return this.returnTeamData(team);
  }

  public async removeLeader(team: ITeam): Promise<ITeamReturnData> {
    team.leaderId = null;
    await team.save();
    return this.returnTeamData(team);
  }

  public async addLeader(
    team: ITeam,
    leaderId: Schema.Types.ObjectId
  ): Promise<ITeamReturnData> {
    team.leaderId = leaderId;
    await team.save();
    return this.returnTeamData(team);
  }

  public async removeMember(
    team: ITeam,
    memberId: Schema.Types.ObjectId
  ): Promise<ITeamReturnData> {
    const memberIndex = team.members.indexOf(memberId);
    team.members.splice(memberIndex, 1);
    await team.save();
    return this.returnTeamData(team);
  }

  public async addMember(
    team: ITeam,
    memberId: Schema.Types.ObjectId
  ): Promise<ITeamReturnData> {
    const memberIndex = team.members.indexOf(memberId);
    if (memberIndex === -1) {
      team.members.push(memberId);
      await team.save();
    }
    return this.returnTeamData(team);
  }

  public async removeMemberInManyTeams(
    _ids: Schema.Types.ObjectId[],
    userId: Schema.Types.ObjectId
  ) {
    const teams = await Team.find({ _id: { $in: _ids } });
    await teams.forEach(async (team) => {
      this.removeMember(team, userId);
    });
  }
}
