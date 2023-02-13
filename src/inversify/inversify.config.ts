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
} from "../middleware/auth.middleware";

const container = new Container();

container.bind<IAuthServices>(TYPES.Auth).to(AuthServices).inRequestScope();
container.bind<IUserServices>(TYPES.User).to(UserServices).inRequestScope();

container.bind<express.RequestHandler>("isLogin").toConstantValue(isLogin);
container.bind<express.RequestHandler>("idAdmin").toConstantValue(isAdmin);
container.bind<express.RequestHandler>("isLeader").toConstantValue(isLeader);
container
  .bind<express.RequestHandler>("canAccessUser")
  .toConstantValue(canAccessUser);

export default container;
