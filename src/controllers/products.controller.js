import { productsService } from "../repository/products.service.js";

export default class ProductsController {
  static async getProductById(req, res) {
    let pId = req.params.pid;

    try {
      let product = await productsService.getProductById(pId);
      if (!product) {
        res.setHeader("Content-Type", "application/json");
        return res.json({ message: "No existe el producto" });
      }
      res.setHeader("Content-Type", "application/json");
      res.status(200).json({ payload: product });
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${error.message}`,
      });
    }
  }

  static async getProducts(req, res) {
    let { limit, page, sort, query } = req.query;

    try {
      let productsPagination = await productsService.getProducts(
        limit,
        page,
        sort,
        query,
        true
      );
      if (productsPagination == "wrongPage")
        return res.json({ message: "No existe la página." });
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(productsPagination);
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${error.message}`,
      });
    }
  }

  static async addProduct(req, res, next) {
    let prod = req.body;

    try {
      let addProd = await productsService.addProduct(prod);

      let realTimeProducts = await productsService.getRealTimeProducts();
      req.socketServer.emit("realTimeProducts", realTimeProducts);
      res.setHeader("Content-Type", "application/json");
      res
        .status(200)
        .json({ message: "Producto agregado con id " + addProd._id });
    } catch (error) {
      return next(error);
    }
  }

  static async updateProduct(req, res) {
    let pId = req.params.pid;
    let fields = req.body;

    try {
      let prod = await productsService.updateProduct(pId, fields);
      if (!prod) return res.send("No existe el producto");
      let realTimeProducts = await productsService.getRealTimeProducts();
      req.socketServer.emit("realTimeProducts", realTimeProducts);
      res.setHeader("Content-Type", "application/json");
      res.status(200).json({ message: "Producto actualizado" });
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${error.message}`,
      });
    }
  }

  static async deleteProduct(req, res) {
    let pId = req.params.pid;

    try {
      let prod = await productsService.deleteProduct(pId);
      if (!prod) return res.send("No existe el producto");
      let realTimeProducts = await productsService.getRealTimeProducts();
      req.socketServer.emit("realTimeProducts", realTimeProducts);
      res.setHeader("Content-Type", "application/json");
      res.status(200).json({ message: "Producto eliminado" });
    } catch (error) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${error.message}`,
      });
    }
  }
}
