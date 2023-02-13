import "reflect-metadata";
import { Container } from "inversify";

import { TYPES } from "./types";
import IAuthServices from "../components/user/services/auth/iauth.services";
import AuthServices from "../components/user/services/auth/auth.services";

const container = new Container();

container.bind<IAuthServices>(TYPES.Auth).to(AuthServices).inRequestScope();

export default container;
