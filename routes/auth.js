const express = require("express");
const AuthController = require("../controllers/auth.controller");

const Router = express.Router();

const Auth = new AuthController();

// login
Router.post("/login", (req, res) => {
  const payload = req.body;
  Auth.login(res, payload);
});

// register
Router.post("/register", (req, res) => {
  const payload = req.body;
  Auth.register(res, payload);
});

module.exports = Router