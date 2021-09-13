const express = require("express");
const router = express.Router();
const login= require("../controllers/login.controllers");

router.get("/Prueba",login.Prueba);
router.post("/login",login.login);

module.exports = router