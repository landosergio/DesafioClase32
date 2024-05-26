import EErrors from "../../services/errors/enums.js";

export default function errorHandler(error, req, res, next) {
  console.log(error.cause);
  res.send("Falopeitor");
  /*   switch (error.code) {
    case EErrors.MISSING_OR_WRONG_DATA_ERRORS:
      res.send({ status: "error", error: error.name });
      break;
    case EErrors.DATABASE_ERRORS:
      res.send({ status: "error", error: error.name });
      break;
    case EErrors.WRONG_CREDENTIALS_ERRORS:
      res.send({ status: "error", error: error.name });
      break;
    default:
      res.send({ status: "error", error: "Unhandled error" });
  } */
}
