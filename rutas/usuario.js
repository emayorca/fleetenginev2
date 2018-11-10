'use strict'

var express = require('express');
var usuarioController = require('../controladores/usuarios');

var api = express.Router();
var md_autentificacion = require('../middlewares/autentificacion');

var multipart = require('connect-multiparty');
var md_subirAvatar = multipart({ uploadDir: './subir/usuarios'});

//Rutas para acceder a metodos
api.get('/pruebas-del-controlador', md_autentificacion.ensureAuth,usuarioController.pruebas);
api.post('/registrar-usuario', usuarioController.guardarUsuario);
api.post('/login-usuario', usuarioController.login);
api.put('/actualizar-usuario/:id', md_autentificacion.ensureAuth,usuarioController.actualizarUsuario);
api.post('/subir-avatar-usuario/:id', [md_autentificacion.ensureAuth, md_subirAvatar],usuarioController.subirImagen);
api.get('/get-imagen-file/:imagenFile', usuarioController.getImagenFile);
api.get('/usuarios', usuarioController.getListarUsuarios);

module.exports = api;