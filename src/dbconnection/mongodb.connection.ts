import mongoose from "mongoose";

export default class MongodbConnection {
  private _conectionString: string = process.env.MONGODB;
  private mongodb: mongoose.Mongoose = mongoose;

  public async startConnect(): Promise<void> {
    try {
      this.config();

      await this.mongodb.connect(this._conectionString, {}).then(async () => {
        console.log("Successfully connected to the database");
      });
    } catch (error) {
      console.log("Could not connect to the database. Exiting now...", error);
      process.exit();
    }
  }

  public config() {
    this.mongodb.set("strictQuery", true);
  }
}
