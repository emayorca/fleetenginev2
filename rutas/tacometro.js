'use strict'

var express = require('express');
var tacometroController = require('../controladores/tacometro');

var api = express.Router();
var md_autentificacion = require('../middlewares/autentificacion');

var multipart = require('connect-multiparty');
var md_subirAvatar = multipart({ uploadDir: './subir/tacometro'});

//Rutas para acceder a metodos
// api.get('/codigos/', md_autentificacion.ensureAuth, tacometroController.findCodigos);
api.get('/codigos/', tacometroController.findCodigos);
api.get('/placas/', tacometroController.findPlacas);
api.get('/ubicacion/', tacometroController.findUbicacion);
api.get('/operador/', tacometroController.findOperador);

module.exports = api;