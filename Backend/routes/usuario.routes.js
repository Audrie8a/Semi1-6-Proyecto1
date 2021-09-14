const express = require("express");
const router = express.Router();
const usuario= require("../controllers/usuario.controllers");

router.get("/Prueba",usuario.Prueba);
router.post("/login",usuario.login);
router.post("/registro",usuario.registro);
router.post("/getUser",usuario.getUsuario);
router.post("/Sugerencias",usuario.getSugerencias)
router.post("/Amigos",usuario.getAmigos)
router.post("/Solicitudes",usuario.getSolicitudes)
router.post("/adminFriends",usuario.manageFriends)

module.exports = router