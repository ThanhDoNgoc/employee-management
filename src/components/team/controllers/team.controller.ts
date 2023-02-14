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
import ITeamReturnData from "../utils/team.return.data";
import logger from "../../../utils/logger";
import { role } from "../../user/utils/user.role";

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
      return await this.teamServices.getAll();
    } catch (error) {
      return response.status(500).send({ message: "Server error!" });
    }
  }

  @httpGet("/details:id")
  public async getById(request: Request, response: Response) {
    try {
      const id = request.body.id;
      const team = await this.teamServices.getById(id);
      return this.teamServices.returnTeamData(team);
    } catch (error) {
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
      return await this.teamServices.create(name);
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

      if (!leader || !team || leader.role !== role.leader) {
        return response
          .status(404)
          .send({ message: "Not found team or leader" });
      }

      return await this.teamServices.addLeader(team, leader._id);
    } catch (error) {
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

      return await this.teamServices.removeLeader(team);
    } catch (error) {
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

      if (!member || !team || member.role !== role.member) {
        response.status(404).send({ message: "Not found team or member" });
      }

      return await this.teamServices.addMember(team, member._id);
    } catch (error) {
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

      return await this.teamServices.removeMember(team, member._id);
    } catch (error) {
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
      return response.status(500).send({ message: "Server error!" });
    }
  }
}
