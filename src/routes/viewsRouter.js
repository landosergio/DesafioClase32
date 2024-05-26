import { Router } from "express";

import ViewsController from "../controllers/views.controller.js";

import { passportCall } from "../utils.js";

import { isLogged } from "../utils.js";
import { isUserCart } from "../utils.js";

const viewsRouter = Router();

viewsRouter.get("/products", isLogged(), ViewsController.getProducts);
viewsRouter.get(
  "/carts/:cid",
  passportCall("jwt"),
  isUserCart(),
  ViewsController.getCartById
);
viewsRouter.get("/realTimeProducts", ViewsController.getRealTimeProducts);
viewsRouter.get("/register", isLogged(), ViewsController.register);
viewsRouter.get("/login", isLogged(), ViewsController.login);
viewsRouter.get("/profile", passportCall("jwt"), ViewsController.profile);

export default viewsRouter;
