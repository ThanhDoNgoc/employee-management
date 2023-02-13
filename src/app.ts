import "reflect-metadata";
import express, { Express } from "express";
import bodyParser from "body-parser";
import cors from "cors";

export class App {
  private app: Express;
  private port = process.env.PORT || 3000;

  constructor(_app: Express) {
    this.app = _app;
  }

  public async start() {
    this.initMiddleware();

    this.app.listen(this.port, () => {
      console.log(`Application is running on http://localhost:${this.port}`);
    });
  }

  public async initMiddleware() {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }
}
