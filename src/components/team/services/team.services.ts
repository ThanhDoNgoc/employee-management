import ITeam from "../model/iteam.model";
import ITeamServices from "./iteam.services";
import Team from "../model/team.model";

export default class TeamServices implements ITeamServices {
  public async create(team: ITeam) {
    const newTeam = new Team(team);
    return await newTeam.save();
  }
  public async updateById(_id: string, team: ITeam) {
    return await Team.findByIdAndUpdate(_id, team).then((team: ITeam) => {
      return team;
    });
  }
  public async getAll() {
    return await Team.find({ isDeleted: false });
  }
  public async getById(_id: string) {
    return await Team.findById(_id);
  }
  public async delete(_id: string) {
    return await Team.findByIdAndUpdate(_id, { isDeleted: true }).then(
      (team: ITeam) => {
        const data = { name: team.name, isDeleted: team.isDeleted };
        return data;
      }
    );
  }
}
