import { currentUserRoutes } from "@auth/routes/currentRoutes";
import { Application } from "express";
import { authRoutes } from "./features/auth/routes/authRoutes";
import { serverAdapter } from "./shared/services/queues/base.queue";
import { authMiddleware } from "./shared/globals/helpers/auth-middleware";

const BASE_PATH = "/api/v1";

export default (app: Application) => {
  const routes = () => {
    app.use("/queues", serverAdapter.getRouter());
    app.use(BASE_PATH, authRoutes.routes());
    app.use(BASE_PATH, authRoutes.signoutRoutes());
    app.use(BASE_PATH, authMiddleware.verifyUser, currentUserRoutes.routes());
  };
  routes();
};
