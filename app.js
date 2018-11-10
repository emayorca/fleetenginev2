'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

// app.use(cors());

//cargar rutas
var usuario_rutas = require('./rutas/usuario');
var equipo_rutas = require('./rutas/equipo');
var equipo_marca_rutas = require('./rutas/equipo_marca');

// Codigo por Luis Muñoz
var tacometro_rutas = require('./rutas/tacometro');

//middlewares de body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Rutas base
app.use(express.static(path.join(__dirname, 'client')));
app.use('/api', usuario_rutas);
app.use('/api', equipo_rutas);
app.use('/api', equipo_marca_rutas);

// Codigo por Luis Muñoz
app.use('/api', tacometro_rutas);

module.exports = app;