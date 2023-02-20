import express, { Router } from "express";
import { Signup } from "@auth/controllers/signup";
import { SignIn } from "@auth/controllers/signin";
import { SignOut } from "@auth/controllers/signout";
import { Password } from "../controllers/password";

class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post("/signup", Signup.prototype.create);
    this.router.post("/signin", SignIn.prototype.read);
    this.router.post("/forgot-password", Password.prototype.create);

    return this.router;
  }

  public signoutRoutes(): Router {
    this.router.get("/signout", SignOut.prototype.logout);

    return this.router;
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes();
