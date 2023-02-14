import mongoose from "mongoose";
import logger from "../utils/logger";

export default class MongodbConnection {
  private _conectionString: string = process.env.MONGODB;
  private mongodb: mongoose.Mongoose = mongoose;

  public async startConnect(): Promise<void> {
    try {
      this.config();

      await this.mongodb.connect(this._conectionString, {}).then(async () => {
        logger.info("Successfully connected to the database");
      });
    } catch (error) {
      logger.error("Could not connect to the database. Exiting now...", error);
      process.exit();
    }
  }

  public config() {
    this.mongodb.set("strictQuery", true);
  }
}
