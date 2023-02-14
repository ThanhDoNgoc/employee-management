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

import IUser, { IUserUpdate } from "../model/iuser.model";
import { TYPES } from "../../../inversify/types";
import { role } from "../utils/user.role";
import IUserServices from "../services/user/iuser.services";
import container from "../../../inversify/inversify.config";
import { status } from "../utils/user.status";
import logger from "../../../utils/logger";
import ITeamServices from "../../team/services/iteam.services";
import { Schema } from "mongoose";
import {
  IUserTeamsReturnData,
  IMembersInSameTeamReturnData,
} from "../utils/user.return.data";
import ITeamReturnData from "../../team/utils/team.return.data";
import IUserReturnData from "../utils/user.return.data";

@controller("/user", container.get<express.RequestHandler>("authorization"))
export default class UserController {
  private userServices: IUserServices;
  private teamServices: ITeamServices;
  constructor(
    @inject(TYPES.User) _userServices: IUserServices,
    @inject(TYPES.Team) _teamServices: ITeamServices
  ) {
    this.userServices = _userServices;
    this.teamServices = _teamServices;
  }

  loadUserRole(inputRole: string): role {
    switch (inputRole) {
      case "admin":
        return role.admin;
      case "leader":
        return role.leader;
      case "member":
        return role.member;
      default:
        return role.member;
    }
  }

  loadUserStatus(inputStatus: string): status {
    switch (inputStatus) {
      case "available":
        return status.available;
      case "unavailable":
        return status.unavailable;
      default:
        return status.available;
    }
  }
  @httpGet("/")
  public async getUsersInSameTeams(request: Request, response: Response) {
    try {
      const teams: Schema.Types.ObjectId[] = request.teams;
      const teamsData: ITeamReturnData[] = await this.teamServices.getByManyId(
        teams
      );
      const returnTeamsData: IUserTeamsReturnData[] = await Promise.all(
        teamsData.map(async (team) => {
          const membersInTeam: IUserReturnData[] =
            await this.userServices.getByManyId(team.members);
          const membersInTeamReturnData: IMembersInSameTeamReturnData[] =
            membersInTeam.map((member) => {
              return {
                name: member.name,
                status: member.status,
                role: member.role,
              };
            });

          const leader: IUser = await this.userServices.getById(team.leaderId);
          let leadername: string | null = null;
          if (leader) {
            leadername = leader.name;
          }
          const teamInfo: IUserTeamsReturnData = {
            teamname: team.name,
            leadername: leadername,
            members: membersInTeamReturnData,
          };
          return teamInfo;
        })
      );
      return returnTeamsData;
    } catch (error) {
      logger.error("Error at User.getUsersInSameTeams controller: ", error);
      return response.status(500).send({ message: "Server error!" });
    }
  }

  @httpGet("/all", container.get<express.RequestHandler>("canModifyUser"))
  public async getAll(response: Response) {
    try {
      return await this.userServices.getAll();
    } catch (error) {
      logger.error("Error at User.getAll controller: ", error);
      return response.status(500).send({ message: "Server error!" });
    }
  }

  @httpGet("/:id", container.get<express.RequestHandler>("canModifyUser"))
  public async getById(request: Request, response: Response) {
    try {
      const id = request.body.id;
      const user = await this.userServices.getById(id);
      return response.status(200).send(this.userServices.returnUserData(user));
    } catch (error) {
      logger.error("Error at User.getById controller: ", error);
      return response.status(500).send({ message: "Server error!" });
    }
  }

  @httpPost("/", container.get<express.RequestHandler>("canModifyUser"))
  public async createUser(request: Request, response: Response) {
    try {
      const user: IUser = request.body;
      user.teams = [];

      if (request.body.role) {
        if (request.role === role.admin)
          user.role = this.loadUserRole(request.body.role);
        else user.role = role.member;
      }

      user.status = status.available;

      const createdUser = await this.userServices.create(user);
      logger.info("Created user: ", createdUser);
      return response.status(201).send(createdUser);
    } catch (error) {
      logger.error("Error at User.createUser controller: ", error);
      return response.status(500).send({ message: "Server error!" });
    }
  }

  @httpPut("/:id", container.get<express.RequestHandler>("canModifyUser"))
  public async updateUser(request: Request, response: Response) {
    try {
      const _id: string = request.params.id;
      const user: IUserUpdate = request.body;

      const updateUser = await this.userServices.getById(_id);

      if (!updateUser) {
        return response.status(404).send({ message: "Not Found" });
      }

      if (request.role === role.leader && updateUser.role !== role.member) {
        return response.status(403).send({ message: "Forbidden" });
      }

      if (request.body.role) {
        if (request.role === role.admin)
          user.role = this.loadUserRole(request.body.role);
        else user.role = updateUser.role;
      }

      if (request.body.status) {
        user.status = this.loadUserStatus(request.body.status);
      }

      const updatedUser = await this.userServices.updateById(_id, user);
      logger.info("Updated user: ", updatedUser);
      return response.status(204).send({ message: "Updated" });
    } catch (error) {
      logger.error("Error at User.updateUser controller: ", error);
      return response.status(500).send({ message: "Server error!" });
    }
  }

  @httpDelete("/:id", container.get<express.RequestHandler>("canModifyUser"))
  public async deleteUser(request: Request, response: Response) {
    try {
      const _id = request.params.id;

      const updateUser = await this.userServices.getById(_id);
      if (!updateUser) {
        return response.status(404).send({ message: "Not Found" });
      }
      if (request.role === role.leader && updateUser.role !== role.member) {
        return response.status(403).send({ message: "Forbidden" });
      }

      const deletedUser = await this.userServices.delete(_id);
      logger.info("Deleted user: ", deletedUser);
      return response.status(204).send({ message: "Deleted" });
    } catch (error) {
      logger.error("Error at User.deleteUser controller: ", error);
      return response.status(500).send({ message: "Server error!" });
    }
  }
}
