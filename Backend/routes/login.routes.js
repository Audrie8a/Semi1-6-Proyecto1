const express = require("express");
const router = express.Router();
const login= require("../controllers/login.controllers");

router.get("/Prueba",login.login);

module.exports = router