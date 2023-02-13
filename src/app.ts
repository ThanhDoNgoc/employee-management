import "reflect-metadata";
import express, { Express } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import container from "./inversify/inversify.config";
import { InversifyExpressServer } from "inversify-express-utils";

import "./components/user/controllers/auth.controller";
import "./components/user/controllers/user.controller";

export class App {
  private app: Express;
  private port = process.env.PORT || 3000;

  constructor(_app: Express) {
    this.app = _app;
  }

  public async start() {
    this.initMiddleware();

    const appConfigured = new InversifyExpressServer(
      container,
      null,
      { rootPath: "/api" },
      this.app
    ).build();

    appConfigured.listen(this.port, () => {
      console.log(`Server listening on http://localhost:${this.port}`);
    });
  }

  public async initMiddleware() {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }
}
