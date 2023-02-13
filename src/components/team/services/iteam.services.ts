import ITeam from "../model/iteam.model";

export default interface ITeamServices {
  create(team: ITeam);
  updateById(_id: string, team: ITeam);
  getAll();
  getById(_id: string);
  delete(_id: string);
}
