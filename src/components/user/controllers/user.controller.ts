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

@controller("/user")
export default class UserController {
  private userServices: IUserServices;

  constructor(@inject(TYPES.User) _userServices: IUserServices) {
    this.userServices = _userServices;
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

  @httpGet(
    "/all",
    container.get<express.RequestHandler>("isLogin"),
    container.get<express.RequestHandler>("canAccessUser")
  )
  public async getAll(response: Response) {
    try {
      return await this.userServices.getAll();
    } catch (error) {
      return response.status(500).send({ message: "Server error!" });
    }
  }

  @httpGet(
    "/:id",
    container.get<express.RequestHandler>("isLogin"),
    container.get<express.RequestHandler>("canAccessUser")
  )
  public async getById(request: Request, response: Response) {
    try {
      const id = request.body.id;
      return await this.userServices.getById(id);
    } catch (error) {
      return response.status(500).send({ message: "Server error!" });
    }
  }

  @httpPost(
    "/",
    container.get<express.RequestHandler>("isLogin"),
    container.get<express.RequestHandler>("canAccessUser")
  )
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

      return response.status(201).send(createdUser);
    } catch (error) {
      return response.status(500).send({ message: "Server error!" });
    }
  }

  @httpPut(
    "/:id",
    container.get<express.RequestHandler>("isLogin"),
    container.get<express.RequestHandler>("canAccessUser")
  )
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

      await this.userServices.updateById(_id, user);

      return response.status(204).send({ message: "Updated" });
    } catch (error) {
      return response.status(500).send({ message: "Server error!" });
    }
  }

  @httpDelete(
    "/:id",
    container.get<express.RequestHandler>("isLogin"),
    container.get<express.RequestHandler>("canAccessUser")
  )
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

      await this.userServices.delete(_id);
      return response.status(204).send({ message: "Deleted" });
    } catch (error) {
      return response.status(500).send({ message: "Server error!" });
    }
  }
}
