'use strict'

var express = require('express');
var equipo_marca_Controller = require('../controladores/equipo_marcas');

var api = express.Router();
var md_autentificacion = require('../middlewares/autentificacion');
var md_admin = require('../middlewares/es_admin');

var multipart = require('connect-multiparty');
var md_subirAvatar = multipart({ uploadDir: './subir/equipo_marcas'});

//Rutas para acceder a metodos
// -- Probar controlador Marcas
api.get('/pruebas-equipos-marcas', md_autentificacion.ensureAuth,equipo_marca_Controller.pruebas);
// -- Guardar Marca -- middlewares solo acceso con ROL_ADMIN
api.post('/marcas', [md_autentificacion.ensureAuth, md_admin.esAdmin],equipo_marca_Controller.guardarMarca);
// -- Listar todas las Marcas
api.get('/marcas',equipo_marca_Controller.getMarcas);
// -- Listar una sola Marca
api.get('/marca/:id',equipo_marca_Controller.getMarca);
// -- Actualiozar Marca -- middlewares solo acceso con ROL_ADMIN
api.put('/marca/:id', [md_autentificacion.ensureAuth, md_admin.esAdmin],equipo_marca_Controller.actualizarMarca);
// -- Subir Avatar de la marca -- middlewares solo acceso con ROL_ADMIN
api.post('/subir-imagen-marca/:id', [md_autentificacion.ensureAuth, md_admin.esAdmin, md_subirAvatar],equipo_marca_Controller.subirImagen);

module.exports = api;