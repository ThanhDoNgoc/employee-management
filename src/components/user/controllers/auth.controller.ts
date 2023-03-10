import { controller, httpGet, httpPost } from "inversify-express-utils";
import "reflect-metadata";

import { inject } from "inversify";
import { Request, Response } from "express";
import IAuthServices from "../services/auth/iauth.services";
import IUser from "../model/iuser.model";
import { TYPES } from "../../../inversify/types";
import { role } from "../utils/user.role";

@controller("/auth")
export default class AuthController {
  private authServices: IAuthServices;

  constructor(@inject(TYPES.Auth) _authServices: IAuthServices) {
    this.authServices = _authServices;
  }

  @httpPost("")
  public async login(request: Request, response: Response) {
    try {
      const username: string = request.body.username;
      const password: string = request.body.password;
      return await this.authServices.login(username, password);
    } catch (error) {
      return response.status(500).send({ message: "Server error!" });
    }
  }

  @httpPost("/register")
  public async register(request: Request) {
    try {
      const user: IUser = request.body;
      user.teams = [];
      if (request.body.role) {
        switch (request.body.role) {
          case "Admin":
            user.role = role.admin;
            break;
          case "Leader":
            user.role = role.leader;
            break;
          case "Member":
            user.role = role.member;
            break;
          default:
            user.role = role.member;
            break;
        }
      }
      return await this.authServices.register(user);
    } catch (error) {}
  }
}
