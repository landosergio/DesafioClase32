import { productsService } from "../repository/products.service.js";
import { cartsService } from "../repository/carts.service.js";

export default class ViewsController {
  static async getProducts(req, res) {
    let { limit, page, sort, query } = req.query;
    let logueado = req.logueado;
    let dbUser = req.user;

    try {
      let productsPagination = await productsService.getProducts(
        limit,
        page,
        sort,
        query,
        false
      );
      if (productsPagination == "wrongPage")
        return res.send("No existe la página.");
      res.render("home", { productsPagination, logueado, dbUser });
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${error.message}`,
      });
    }
  }

  static async getCartById(req, res) {
    let cId = req.params.cid;

    try {
      let cart = await cartsService.getCartById(cId);
      if (!cart) {
        res.setHeader("Content-Type", "application/json");
        return res.send("No existe el carrito");
      }
      res.status(200).render("cart", { cart });
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${error.message}`,
      });
    }
  }

  static async getRealTimeProducts(req, res) {
    res.render("realTimeProducts");
  }

  static async register(req, res) {
    let logueado = req.logueado;
    res.render("register", { logueado });
  }

  static async login(req, res) {
    let logueado = req.logueado;
    let loginError = req.query.loginError || false;

    res.render("login", { logueado, loginError });
  }

  static async profile(req, res) {
    let logueado;
    let dbUser;

    if (req.user) {
      dbUser = req.user;
      logueado = true;
    } else {
      logueado = false;
    }

    res.render("profile", { logueado, dbUser });
  }
}
