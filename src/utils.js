import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import config from "./config/config.js";
import { es, faker } from "@faker-js/faker";

const privateKey = config.privateKey;

const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

////////////////////////////////////////////////////////
// A  U  T  H      Y      L  O  G  I  N

export function passportCall(strategy) {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        return res
          .status(401)
          .send({ error: info.message ? info.message : info.toString() });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
}

export function isLogged() {
  return async (req, res, next) => {
    const token = req.cookies["tokenCookie"];
    jwt.verify(token, privateKey, (error, credentials) => {
      req.logueado = true;
      req.user = credentials;
      if (error) req.logueado = false;
    });
    next();
  };
}

export function authRole(roles) {
  return async (req, res, next) => {
    if (roles.includes(req.user?.role)) {
      return next();
    }

    res.setHeader("Content-Type", "application/json");
    res.status(401).json({ message: "Not enough credentials" });
  };
}

////////////////////////////////////////////////////////
// J  W  T      Y      C  I  F  R  A  D  O

export function createHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

export function isValidPassword(user, password) {
  return bcrypt.compareSync(password, user.password);
}

export function generateToken(user) {
  const token = jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
      age: user.age,
      last_name: user.last_name,
      first_name: user.first_name,
      cart: user.cart,
    },
    privateKey,
    {
      expiresIn: "1d",
    }
  );
  return token;
}

////////////////////////////////////////////////////////
// F  A K  E  R

faker.location = es;

export function generateUser() {
  return {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    age: faker.number.int({ min: 18, max: 110 }),
    password: faker.internet.password({ length: 10 }),
    role: "USER",
    cart: faker.database.mongodbObjectId(),
  };
}

export function generateProduct() {
  return {
    _id: faker.database.mongodbObjectId(),
    title: faker.commerce.product(),
    description: faker.commerce.productDescription(),
    price: faker.number.int({ min: 1000, max: 500000 }),
    thumbnail: [generateThumbnail(), generateThumbnail(), generateThumbnail()],
    code: faker.commerce.isbn(10),
    stock: faker.number.int({ min: 0, max: 1000 }),
    status: true,
  };
}

function generateThumbnail() {
  return faker.image.urlLoremFlickr({ category: "product" });
}

////////////////////////////////////////////////////////
// V  A  R  I  O  S

export function isUserCart() {
  return async (req, res, next) => {
    if (req.user?.cart._id == req.params.cid) return next();
    //
    if (req.body.id == req.params.cid) return next();
    //
    res.setHeader("Content-Type", "application/json");
    res.status(401).json({ message: "Este no es tu carrito" });
  };
}

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////

/* 
Al usar algún filtro de Mongo en la búsqueda de productos, el link a las páginas siguiente y anterior en "api/products"
aparecía con las comillas escapadas y no se podía utilizar para navegar. Ej: http://...{"status":true} => http://...{/"status/":true}

Para resolverlo, el filtro debe enviarse sin comillas. Las siguientes funciones transforman al string en un JSON con formato correcto
buscando los índices de todos los ":" y "{" y agregando las comillas necesarias. Se pueden usar filtros complejos como {price:{$gt:2000}}
y este se convertirá en {"price":{"$gt":2000}} para realizar la búsqueda en Mongo.
*/

export function getInd(arr, val) {
  let indexes = [],
    i = -1;
  while ((i = arr.indexOf(val, i + 1)) != -1) {
    indexes.push(i);
  }
  return indexes;
}

export function JSONify(str) {
  let strArr = [...str];

  let colonIndexes = getInd(strArr, ":");
  let counter = 0;
  colonIndexes.forEach((i) => {
    strArr.splice(i + counter, 0, '"');
    counter++;
  });

  let bracketIndexes = getInd(strArr, "{");
  counter = 0;
  bracketIndexes.forEach((i) => {
    strArr.splice(i + 1 + counter, 0, '"');
    counter++;
  });

  let JSONstr = strArr.join("");

  return JSONstr;
}

////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
