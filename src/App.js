import express from "express";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/viewsRouter.js";
import sessionsRouter from "./routes/sessions.router.js";

import handlebars from "express-handlebars";

import { Server } from "socket.io";

import { productsService } from "./repository/products.service.js";

import cookieParser from "cookie-parser";

import passport from "passport";
import initializePassport from "./config/passport.config.js";

import { __dirname } from "./utils.js";
import config from "./config/config.js";
import { generateProduct } from "./utils.js";
import errorHandler from "./middlewares/errors/index.js";

const { port } = config;

//Express
export const app = express();
const httpServer = app.listen(port, () =>
  console.log("Escuchando en puerto " + port)
);

// Middlewares

app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

initializePassport();
app.use(passport.initialize());

app.use(errorHandler);

//Socket.io
const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
  console.log("Cliente conectado");

  let products;
  try {
    products = await productsService.getRealTimeProducts();
  } catch (error) {
    res.setHeader("Content-Type", "application/json");
    res.status(500).json({
      error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
      detalle: `${error.message}`,
    });
  }
  socketServer.emit("realTimeProducts", products);
});

// Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Router
app.get("/", (req, res) => {
  res.redirect("http://localhost:8080/login");
});

app.get("/mockingproducts", (req, res) => {
  let products = [];
  for (let i = 1; i <= 100; i++) {
    products.push(generateProduct());
  }
  res.setHeader("Content-Type", "application/json");
  res.status(200).json({ payload: products });
});

app.use("/", viewsRouter);
app.use(
  "/api/products",
  (req, res, next) => {
    req.socketServer = socketServer;
    return next();
  },
  productsRouter
);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);
