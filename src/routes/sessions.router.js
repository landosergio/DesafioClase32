import { Router } from "express";

import passport from "passport";

import { passportCall } from "../utils.js";

import SessionsController from "../controllers/sessions.controller.js";

const sessionsRouter = Router();

sessionsRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"], session: false }),
  async (req, res) => {}
);

sessionsRouter.get(
  "/githubcallback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    session: false,
  }),
  SessionsController.githubCallback
);

sessionsRouter.get("/current", passportCall("jwt"), SessionsController.current);

sessionsRouter.get("/logout", SessionsController.logout);

sessionsRouter.post(
  "/register",
  passportCall("register"),
  SessionsController.register
);

sessionsRouter.post("/login", passportCall("login"), SessionsController.login);

export default sessionsRouter;
