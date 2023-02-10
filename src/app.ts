import express, { Express } from "express";
import { TalkyServer } from "./setupServer";
import databaseConnection from "./setupDatabase";
class Application {
  public initialize(): void {
    databaseConnection();
    const app: Express = express();

    const server: TalkyServer = new TalkyServer(app);

    server.start();
  }
}

const application: Application = new Application();

application.initialize();
