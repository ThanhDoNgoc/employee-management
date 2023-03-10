import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
} from "inversify-express-utils";
import "reflect-metadata";
import { inject } from "inversify";
import { Request, Response } from "express";
import * as express from "express";

import { TYPES } from "../../../inversify/types";
import container from "../../../inversify/inversify.config";
import ITeamServices from "../services/iteam.services";
import IUserServices from "../../user/services/user/iuser.services";
import logger from "../../../utils/logger";
import { role } from "../../user/utils/user.role";
import { status } from "../../user/utils/user.status";
import {
  IMember,
  ITeamDetailReturnData,
  ITeamsReturnData,
} from "../utils/team.return.data";

@controller("/team", container.get<express.RequestHandler>("authorization"))
export default class TeamController {
  private teamServices: ITeamServices;
  private userServices: IUserServices;
  constructor(
    @inject(TYPES.Team) _teamServices: ITeamServices,
    @inject(TYPES.User) _userServices: IUserServices
  ) {
    this.teamServices = _teamServices;
    this.userServices = _userServices;
  }

  @httpGet("/", container.get<express.RequestHandler>("canModifyTeam"))
  public async getAll(request: Request, response: Response) {
    try {
      const allTeams = await this.teamServices.getAll();
      const returnAllTeams: ITeamsReturnData[] = await Promise.all(
        allTeams.map(async (team) => {
          const leader = await this.userServices.getById(team.leaderId);
          const leaderReturnData: IMember | null =
            leader === null
              ? null
              : {
                  _id: leader._id,
                  name: leader.name,
                  username: leader.username,
                };
          const teamData: ITeamsReturnData = {
            _id: team._id,
            name: team.name,
            leader: leaderReturnData,
          };
          return teamData;
        })
      );
      return response.status(200).send(returnAllTeams);
    } catch (error) {
      logger.error("Error at Team.getAll controller: ", error);
      return response.status(500).send({ message: "Server error!" });
    }
  }

  @httpGet("/details/:id")
  public async getById(request: Request, response: Response) {
    try {
      const id = request.params.id;
      const team = await this.teamServices.getById(id);
      const leader: IMember | null = await this.userServices.getById(
        team.leaderId
      );
      const leaderReturnData: IMember | null =
        leader === null
          ? null
          : {
              _id: leader._id,
              name: leader.name,
              username: leader.username,
            };
      const members: IMember[] = await Promise.all(
        team.members.map(async (memberId) => {
          return await this.userServices.getById(memberId);
        })
      );
      const returnTeamDetail: ITeamDetailReturnData = {
        _id: team._id,
        name: team.name,
        leader: leaderReturnData,
        members: members,
      };
      return response.status(200).send(returnTeamDetail);
    } catch (error) {
      logger.error("Error at Team.getById controller: ", error);
      return response.status(500).send({ message: "Server error!" });
    }
  }

  @httpPost("", container.get<express.RequestHandler>("canModifyTeam"))
  public async createTeam(request: Request, response: Response) {
    try {
      const name: string = request.body.name;
      if ((await this.teamServices.getByName(name)) !== null) {
        return response.status(400).send({ message: "Name exits" });
      }
      const newTeam = await this.teamServices.create(name);
      logger.info("Created new Team: ", newTeam);
      return response.status(201).send({ message: "Created team" });
    } catch (error) {
      logger.error("Error at createTeam ", error);
      return response.status(500).send({ message: "Server error!" });
    }
  }

  @httpPut("/:id", container.get<express.RequestHandler>("canModifyTeam"))
  public async updateTeam(request: Request, response: Response) {
    try {
    } catch (error) {
      return response.status(500).send({ message: "Server error!" });
    }
  }

  @httpPut(
    "/addLeader/:id",
    container.get<express.RequestHandler>("canModifyTeam")
  )
  public async addLeader(request: Request, response: Response) {
    try {
      const leaderId = request.body.id;
      const teamId = request.params.id;

      if (!leaderId || !teamId) {
        return response
          .status(400)
          .send({ message: "Missing leaderId or teamId" });
      }

      const leader = await this.userServices.getById(leaderId);
      const team = await this.teamServices.getById(teamId);

      if (team.leaderId !== null) {
        return response
          .status(404)
          .send({ message: "This team already have leader" });
      }

      if (
        !leader ||
        !team ||
        leader.role !== role.leader ||
        leader.status === status.unavailable
      ) {
        return response
          .status(404)
          .send({ message: "Not found team or leader" });
      }
      await this.userServices.addTeam(leader, team._id);
      const addTeamLeader = await this.teamServices.addLeader(team, leader._id);

      logger.info("Added team leader: ", addTeamLeader);
      return response.status(204).send({ message: "Added" });
    } catch (error) {
      logger.error("Error at Team.addLeader controller: ", error);
      return response.status(500).send({ message: "Server error!" });
    }
  }

  @httpPut(
    "/removeLeader/:id",
    container.get<express.RequestHandler>("canModifyTeam")
  )
  public async removeLeader(request: Request, response: Response) {
    try {
      const teamId = request.params.id;

      const team = await this.teamServices.getById(teamId);

      if (!team) {
        response.status(404).send({ message: "Not found team or leader" });
      }
      const teamLeader = await this.userServices.getById(team.leaderId);
      await this.userServices.removeTeam(teamLeader, team._id);
      const removeTeamLeader = await this.teamServices.removeLeader(team);
      logger.info("Removed team leader: ", removeTeamLeader);
      return response.status(204).send({ message: "removed leader" });
    } catch (error) {
      logger.error("Error at Team.removeLeader controller: ", error);
      return response.status(500).send({ message: "Server error!" });
    }
  }

  @httpPut("/addMember/:id")
  public async addMember(request: Request, response: Response) {
    try {
      const memberId = request.body.id;
      const teamId = request.params.id;

      const member = await this.userServices.getById(memberId);
      const team = await this.teamServices.getById(teamId);

      if (
        !member ||
        !team ||
        member.role !== role.member ||
        member.status === status.unavailable
      ) {
        response.status(404).send({ message: "Not found team or member" });
      }

      const memberIndex = team.members.indexOf(memberId);
      if (memberIndex !== -1) {
        return response
          .status(200)
          .send({ message: "Team already have this member" });
      }

      await this.userServices.addTeam(member, team._id);
      const addTeamMember = await this.teamServices.addMember(team, member._id);
      logger.info("Added team member: ", addTeamMember);
      return response.status(204).send({ message: "Added member" });
    } catch (error) {
      logger.error("Error at Team.addMember controller: ", error);
      return response.status(500).send({ message: "Server error!" });
    }
  }

  @httpPut("/removeMember/:id")
  public async removeMember(request: Request, response: Response) {
    try {
      const memberId = request.body.id;
      const teamId = request.params.id;

      const member = await this.userServices.getById(memberId);
      const team = await this.teamServices.getById(teamId);

      if (!member || !team) {
        response.status(404).send({ message: "Not found team or member" });
      }
      await this.userServices.removeTeam(member, team._id);
      const removeTeamMember = await this.teamServices.removeMember(
        team,
        member._id
      );

      logger.info("Removed team member: ", removeTeamMember);
      return response.status(204).send({ message: "removed member" });
    } catch (error) {
      logger.error("Error at Team.removeMember controller: ", error);
      return response.status(500).send({ message: "Server error!" });
    }
  }

  @httpDelete("/:id", container.get<express.RequestHandler>("canModifyTeam"))
  public async deleteTeam(request: Request, response: Response) {
    try {
      const teamId = request.params.id;
      const team = await this.teamServices.getById(teamId);
      const leader = await this.userServices.getById(team.leaderId);
      await this.userServices.removeTeamInManyUsers(team.members, team._id);
      await this.userServices.removeTeam(leader, team._id);
      await this.teamServices.delete(team);
      return response.status(204).send({ message: "Deleted" });
    } catch (error) {
      logger.error("Error at Team.deleteTeam controller: ", error);
      return response.status(500).send({ message: "Server error!" });
    }
  }
}
