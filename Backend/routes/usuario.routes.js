const { Route53RecoveryControlConfig } = require("aws-sdk");
const express = require("express");
const router = express.Router();
const usuario= require("../controllers/usuario.controllers");

router.get("/Prueba",usuario.Prueba);
router.post("/login",usuario.login);
router.post("/registro",usuario.registro);
router.post("/getUser",usuario.getUsuario);
//endpoints de diego
router.post("/verifica", usuario.verificando);
router.post("/subirFile", usuario.SubirFile);
router.post("/getFiles", usuario.getArchivos);
router.post("/getMisFiles", usuario.getMisArchivos);
router.post("/Eliminar", usuario.EliminarFile);
router.post("/editFile", usuario.EditFile);
module.exports = router