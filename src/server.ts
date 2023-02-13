import { App } from "./app";
import * as dotenv from "dotenv";
import express from "express";

dotenv.config();
const app = express();
const server = new App(app);

server.start();
