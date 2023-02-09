import express, { Express } from "express";
import { TalkyServer } from "./setupServer";

class Application {
  public initialize(): void {
    const app: Express = express();
    const server: TalkyServer = new TalkyServer(app);

    server.start();
  }
}

const application: Application = new Application();

application.initialize();
