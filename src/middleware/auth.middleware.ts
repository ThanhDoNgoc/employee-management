import jwt from "jsonwebtoken";

import { Request, Response, NextFunction } from "express";
import { TokenExpiredError } from "jsonwebtoken";
import { role } from "../components/user/utils/user.role";
import logger from "../utils/logger";

function catchError(error, response) {
  if (error instanceof TokenExpiredError) {
    logger.info("Access Token expired!", error.expiredAt);
    return response.status(401).send({ message: "Access Token expired!" });
  }
  return response.status(403).send({ message: "Forbidden!" });
}

export function isLogin(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    if (!request.header("Authorization"))
      return response.status(401).send({ message: "Unauthorized!" });

    const token: string = request
      .header("Authorization")
      .replace("Bearer ", "");

    if (!token) {
      return response.status(401).send({ message: "Unauthorized!" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        catchError(error, response);
      }
      request.role = decoded.role;
      next();
    });
  } catch (error) {
    logger.error("Error at isLogin middleware", error);
    return response.status(500).send({ message: "Server Error" });
  }
}

export function isAdmin(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    if (request.role === role.admin) {
      next();
      return;
    }

    return response.status(403).send({ message: "Forbidden!" });
  } catch (error) {
    logger.error("Error at isAdmin middleware", error);
    return response.status(500).send({ message: "Server Error" });
  }
}

export function isLeader(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    if (request.role === role.leader) {
      next();
      return;
    }

    return response.status(403).send({ message: "Forbidden!" });
  } catch (error) {
    logger.error("Error at isLeader middleware", error);
    return response.status(500).send({ message: "Server Error" });
  }
}

export function canAccessUser(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    if (request.role === role.leader || request.role === role.admin) {
      next();
      return;
    }
    return response.status(403).send({ message: "Forbidden!" });
  } catch (error) {
    logger.error("Error at canAccessUser middleware", error);
    return response.status(500).send({ message: "Server Error" });
  }
}

export function canAccessTeam(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    if (request.role === role.admin) {
      next();
      return;
    }
    return response.status(403).send({ message: "Forbidden!" });
  } catch (error) {
    logger.error("Error at canAccessTeam middleware", error);
    return response.status(500).send({ message: "Server Error" });
  }
}
