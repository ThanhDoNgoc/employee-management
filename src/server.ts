import { App } from "./app";
import * as dotenv from "dotenv";
import express from "express";

import MongodbConnection from "./dbconnection/mongodb.connection";

dotenv.config();
const app = express();
const server = new App(app);

const dbConnect = new MongodbConnection();
dbConnect.startConnect();

server.start();
