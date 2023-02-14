import jwt from "jsonwebtoken";

import { Request, Response, NextFunction } from "express";
import { TokenExpiredError } from "jsonwebtoken";
import { role } from "../components/user/utils/user.role";
import logger from "../utils/logger";
import User from "../components/user/model/user.model";

function catchError(error, response) {
  if (error instanceof TokenExpiredError) {
    return response.status(401).send({ message: "Access Token expired!" });
  }
  return response.status(401).send({ message: "Unauthorized!" });
}

export async function authorization(
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

    await jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
      if (error) {
        catchError(error, response);
        return;
      }
      const requesterId = decoded._id;
      const requester = await User.findById(requesterId);
      request.teams = requester.teams;
      request.role = requester.role;
      next();
    });
  } catch (error) {
    logger.error("Error at authorization middleware", error);
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

export function canModifyUser(
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

export function canModifyTeam(
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
