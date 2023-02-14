import "reflect-metadata";
import { Container } from "inversify";

import { TYPES } from "./types";
import IAuthServices from "../components/user/services/auth/iauth.services";
import AuthServices from "../components/user/services/auth/auth.services";
import IUserServices from "../components/user/services/user/iuser.services";
import UserServices from "../components/user/services/user/user.services";
import * as express from "express";
import {
  isLogin,
  isAdmin,
  isLeader,
  canAccessUser,
  canAccessTeam,
} from "../middleware/auth.middleware";
import ITeamServices from "../components/team/services/iteam.services";
import TeamServices from "../components/team/services/team.services";

const container = new Container();

container.bind<IAuthServices>(TYPES.Auth).to(AuthServices).inRequestScope();
container.bind<IUserServices>(TYPES.User).to(UserServices).inRequestScope();
container.bind<ITeamServices>(TYPES.Team).to(TeamServices).inRequestScope();

container.bind<express.RequestHandler>("isLogin").toConstantValue(isLogin);
container.bind<express.RequestHandler>("idAdmin").toConstantValue(isAdmin);
container.bind<express.RequestHandler>("isLeader").toConstantValue(isLeader);
container
  .bind<express.RequestHandler>("canAccessUser")
  .toConstantValue(canAccessUser);
container
  .bind<express.RequestHandler>("canAccessTeam")
  .toConstantValue(canAccessTeam);

export default container;
