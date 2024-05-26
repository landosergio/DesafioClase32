import { Router } from "express";
import ProductsController from "../controllers/products.controller.js";
import { passportCall } from "../utils.js";
import { authRole } from "../utils.js";

const productsRouter = Router();

productsRouter.get("/:pid", ProductsController.getProductById);
productsRouter.get("/", ProductsController.getProducts);
productsRouter.post(
  "/",
  passportCall("jwt"),

  authRole(["ADMIN"]),
  ProductsController.addProduct
);
productsRouter.delete(
  "/:pid",
  passportCall("jwt"),
  authRole(["ADMIN"]),
  ProductsController.deleteProduct
);
productsRouter.put(
  "/:pid",
  passportCall("jwt"),
  authRole(["ADMIN"]),
  ProductsController.updateProduct
);

export default productsRouter;
