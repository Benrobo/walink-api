const express = require("express");
const LinkController = require("../controllers/link.controller");
const isLoggedIn = require("../middlewares/isLoggedIn")

const Router = express.Router();

const Link = new LinkController();

// get link by userId
Router.get("/get/byUserId", isLoggedIn , (req, res) => {
  Link.allLinkByUserId(res);
});

// get link by id
Router.get("/get/byId/:linkId", isLoggedIn , (req, res) => {
  const {linkId} = req.params;
  Link.allLinkById(res, linkId);
});


// create 
Router.post("/create", isLoggedIn , (req, res) => {
  const payload = req.body;
  Link.add(res, payload);
});

// update link status
Router.put("/update", isLoggedIn , (req, res) => {
  const payload = req.body;
  Link.updateLinkStatus(res, payload);
});

// delete
Router.delete("/delete/:linkId", isLoggedIn , (req, res) => {
  const {linkId} = req.params;
  Link.delete(res, linkId);
});

module.exports = Router

