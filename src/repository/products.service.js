import { ProductsDAO } from "../dao/factory.js";

import { JSONify } from "../utils.js";

class ProductsService {
  constructor(dao) {
    this.productsDAO = dao;
  }

  async getProductById(pId) {
    return await this.productsDAO.getProductById(pId);
  }

  async getProducts(limit = 10, page = 1, sort = null, query, api) {
    let queryJSON;
    query ? (queryJSON = JSON.parse(JSONify(query))) : (queryJSON = {});

    let products = await this.productsDAO.getProducts(
      limit,
      page,
      sort,
      queryJSON
    );

    if (page > products.totalPages || page < 1 || isNaN(page)) {
      return "wrongPage";
    }

    for (let prod of products.docs) {
      delete prod.id;
    }

    let productsPagination = {
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
    };

    (productsPagination.prevLink =
      productsPagination.hasPrevPage &&
      `http://localhost:8080/${api ? "api/" : ""}products/?limit=${limit}${
        (query && `&query=${query}`) || ""
      }${sort ? "&sort=" + sort : ""}&page=${productsPagination.prevPage}`),
      (productsPagination.nextLink =
        productsPagination.hasNextPage &&
        `http://localhost:8080/${api ? "api/" : ""}products/?limit=${limit}${
          (query && `&query=${query}`) || ""
        }${sort ? "&sort=" + sort : ""}&page=${productsPagination.nextPage}`);

    return productsPagination;
  }

  async getRealTimeProducts() {
    return await this.productsDAO.getRealTimeProducts();
  }

  async addProduct(prod) {
    if (
      !prod.title ||
      !prod.description ||
      !prod.price ||
      !prod.thumbnail ||
      !prod.code ||
      !prod.stock
    )
      return "missingInfo";

    prod.status = true;
    return await this.productsDAO.addProduct(prod);
  }

  async updateProduct(pId, fields) {
    let prod = await this.productsDAO.getProductById(pId);
    if (!prod) return false;
    return await this.productsDAO.updateProduct(pId, fields);
  }

  async deleteProduct(pId) {
    let prod = await this.productsDAO.getProductById(pId);
    if (!prod) return false;
    return await this.productsDAO.deleteProduct(pId);
  }

  async checkStock(prods) {
    let availProds = [];
    let rest = [];

    for (const product of prods) {
      let cant = product.quantity;
      let pId = product.product._id;

      let hayStock = await this.productsDAO.checkStock(pId, cant);

      if (hayStock[0] != null) {
        availProds.push(product);
      } else {
        rest.push(product);
      }
    }

    return { availProds, rest };
  }

  async updateStock(prods) {
    for (const product of prods) {
      let cant = product.product.stock - product.quantity;
      let pId = product.product._id;

      await this.productsDAO.updateProduct(pId, { stock: cant });
    }
  }
}

export const productsService = new ProductsService(new ProductsDAO());
