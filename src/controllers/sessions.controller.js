import { generateToken } from "../utils.js";
import userDTO from "../dao/dto/users.dto.js";

class SessionsController {
  static async register(req, res) {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ message: "Usuario creado" });
  }

  static async githubCallback(req, res) {
    req.user.email = req.user.email || "Github account";
    const access_token = generateToken(req.user);
    res
      .cookie("tokenCookie", access_token, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      })
      .redirect("http://localhost:8080/products");
  }

  static async login(req, res) {
    const access_token = generateToken(req.user);
    res
      .cookie("tokenCookie", access_token, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
      })
      .redirect("http://localhost:8080/products");
  }

  static async current(req, res) {
    let user = new userDTO(req.user);

    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ user });
  }

  static async logout(req, res) {
    res.clearCookie("tokenCookie").redirect("http://localhost:8080/login/");
  }
}

export default SessionsController;
