import "reflect-metadata";
import { Container } from "inversify";

import { TYPES } from "./types";
import IAuthServices from "../components/user/services/auth/iauth.services";
import AuthServices from "../components/user/services/auth/auth.services";
import IUserServices from "../components/user/services/user/iuser.services";
import UserServices from "../components/user/services/user/user.services";
import * as express from "express";
import {
  authorization,
  isAdmin,
  isLeader,
  canModifyUser,
  canModifyTeam,
} from "../middleware/auth.middleware";
import ITeamServices from "../components/team/services/iteam.services";
import TeamServices from "../components/team/services/team.services";

const container = new Container();

container.bind<IAuthServices>(TYPES.Auth).to(AuthServices).inRequestScope();
container.bind<IUserServices>(TYPES.User).to(UserServices).inRequestScope();
container.bind<ITeamServices>(TYPES.Team).to(TeamServices).inRequestScope();

container
  .bind<express.RequestHandler>("authorization")
  .toConstantValue(authorization);
container.bind<express.RequestHandler>("idAdmin").toConstantValue(isAdmin);
container.bind<express.RequestHandler>("isLeader").toConstantValue(isLeader);
container
  .bind<express.RequestHandler>("canModifyUser")
  .toConstantValue(canModifyUser);
container
  .bind<express.RequestHandler>("canModifyTeam")
  .toConstantValue(canModifyTeam);

export default container;
