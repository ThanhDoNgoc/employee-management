import { controller, httpGet, httpPost } from "inversify-express-utils";
import "reflect-metadata";

import { inject } from "inversify";
import { Request } from "express";
import IAuthServices from "../services/auth/iauth.services";
import IUser from "../model/iuser.model";
import { TYPES } from "../../../inversify/types";
import { role } from "../utils/user.role";

@controller("/auth")
export default class AuthController {
  private authServices: IAuthServices;

  constructor(@inject(TYPES.Auth) _userServices: IAuthServices) {
    this.authServices = _userServices;
  }

  @httpGet("")
  public async login(request: Request) {
    try {
      const username: string = request.body.username;
      const password: string = request.body.password;
      return await this.authServices.login(username, password);
    } catch (error) {
      console.log(error);
    }
  }

  @httpPost("")
  public async register(request: Request) {
    try {
      const user: IUser = request.body;
      user.teams = [];

      switch (request.body.role) {
        case "admin":
          user.role = role.admin;
          break;
        case "leader":
          user.role = role.leader;
          break;
        case "member":
          user.role = role.member;
          break;
        default:
          user.role = role.member;
          break;
      }
      return await this.authServices.register(user);
    } catch (error) {
      console.log(error);
    }
  }
}
