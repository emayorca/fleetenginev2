'use strict'

var express = require('express');
var equipoController = require('../controladores/equipos');

//****************************************************
// subir archivo con Multer - por Luis Muñoz
var multer = require('multer');
// Configurar multer
// var upload = multer( { dest: './subir/controles'} );
var storage = multer.diskStorage({
	destination: function( req, file, cb ) {
		cb(null, './subir/controles');
	},
	filename: function ( req, file, cb ) {
		// Obtenemos la extensión del archivo.
		var name = file.originalname.split(".")[0].replace(/\s/g,'-'); // reemplazar todos los espacios en blanco.
		var extension = file.originalname.split(".")[file.originalname.split(".").length - 1 ];
		cb( null, `${ Date.now() }-${name}.${extension}` );
	}
});

var upload = multer({ storage: storage });

/// Fin de configuracion de Multer
//****************************************************

var api = express.Router();
var md_autentificacion = require('../middlewares/autentificacion');
var md_admin = require('../middlewares/es_admin');

var multipart = require('connect-multiparty');
var md_subirAvatar = multipart({ uploadDir: './subir/equipos'});

//Rutas para acceder a metodos
// -- Probar controlador Equipo
api.get('/pruebas-equipos', md_autentificacion.ensureAuth,equipoController.pruebas);
// -- Guardar Equipo -- middlewares solo acceso con ROL_ADMIN
api.post('/equipos', [md_autentificacion.ensureAuth, md_admin.esAdmin],equipoController.guardarEquipo);
// -- Listar todos los Equipo
api.get('/equipos',equipoController.getEquipos);

// TRABAJAR CON CONTROLES
api.get('/equipos/control/:id', equipoController.getControles);
api.post('/equipos/control', equipoController.setControles);
api.post('/equipos/mantener-controles', upload.array('archivos', 12), equipoController.mantenerControles);
// api.post('/equipos/uploadfiles', upload.array('archivos', 12), equipoController.uploadFiles);

// -- Listar un solo Equipo
api.get('/equipo/:id',equipoController.getEquipo);
//middlewares solo acceso con ROL_ADMIN
api.put('/equipo/:id', [md_autentificacion.ensureAuth, md_admin.esAdmin],equipoController.actualizarEquipo);
//middlewares solo acceso con ROL_ADMIN
api.post('/subir-imagen-equipo/:id', [md_autentificacion.ensureAuth, md_admin.esAdmin, md_subirAvatar],equipoController.subirImagen);
api.get('/get-imagen-equipo/:imagenFile', equipoController.getImagenFile);
//middlewares solo acceso con ROL_ADMIN
api.delete('/equipo/:id', [md_autentificacion.ensureAuth, md_admin.esAdmin], equipoController.borrarEquipo);

module.exports = api;