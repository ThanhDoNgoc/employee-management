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

@controller(
  "/team",
  container.get<express.RequestHandler>("isLogin"),
  container.get<express.RequestHandler>("canAccessUser")
)
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

  @httpGet("/")
  public async getAll(response: Response) {
    try {
      const allTeams = await this.teamServices.getAll();
      return response.status(200).send(allTeams);
    } catch (error) {
      logger.error("Error at Team.getAll controller: ", error);
      return response.status(500).send({ message: "Server error!" });
    }
  }

  @httpGet("/details:id")
  public async getById(request: Request, response: Response) {
    try {
      const id = request.body.id;
      const team = await this.teamServices.getById(id);
      return response.status(200).send(this.teamServices.returnTeamData(team));
    } catch (error) {
      logger.error("Error at Team.getById controller: ", error);
      return response.status(500).send({ message: "Server error!" });
    }
  }

  @httpPost("")
  public async createTeam(request: Request, response: Response) {
    try {
      const name: string = request.body.name;
      if ((await this.teamServices.getByName(name)) !== null) {
        return response.status(400).send({ message: "Name exits" });
      }
      logger.info(" pass name valid");
      const newTeam = await this.teamServices.create(name);
      logger.info("Created new Team: ", newTeam);
      return response.status(201).send("Created team: ", newTeam);
    } catch (error) {
      logger.error("Error at createTeam ", error);
      return response.status(500).send({ message: "Server error!" });
    }
  }

  @httpPut("/:id")
  public async updateTeam(request: Request, response: Response) {
    try {
    } catch (error) {
      return response.status(500).send({ message: "Server error!" });
    }
  }

  @httpPut("/addLeader/:id")
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

      const addTeamLeader = await this.teamServices.addLeader(team, leader._id);
      logger.info("Added team leader: ", addTeamLeader);
      return response.status(204).send(addTeamLeader);
    } catch (error) {
      logger.error("Error at Team.addLeader controller: ", error);
      return response.status(500).send({ message: "Server error!" });
    }
  }

  @httpPut("/removeLeader/:id")
  public async removeLeader(request: Request, response: Response) {
    try {
      const teamId = request.params.id;

      const team = await this.teamServices.getById(teamId);

      if (!team) {
        response.status(404).send({ message: "Not found team or leader" });
      }

      const removeTeamLeader = await this.teamServices.removeLeader(team);
      logger.info("Removed team leader: ", removeTeamLeader);
      return response.status(204).send(removeTeamLeader);
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

      const addTeamMember = await this.teamServices.addMember(team, member._id);
      logger.info("Added team member: ", addTeamMember);
      return response.status(204).send(addTeamMember);
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

      const removeTeamMember = await this.teamServices.removeMember(
        team,
        member._id
      );
      logger.info("Removed team member: ", removeTeamMember);
      return response.status(204).send(removeTeamMember);
    } catch (error) {
      logger.error("Error at Team.removeMember controller: ", error);
      return response.status(500).send({ message: "Server error!" });
    }
  }

  @httpDelete("/:id")
  public async deleteTeam(request: Request, response: Response) {
    try {
      const teamId = request.params.id;
      const team = await this.teamServices.getById(teamId);

      if (!team) await this.teamServices.delete(teamId);
      return response.status(204).send({ message: "Deleted" });
    } catch (error) {
      logger.error("Error at Team.deleteTeam controller: ", error);
      return response.status(500).send({ message: "Server error!" });
    }
  }
}
