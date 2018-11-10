'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usuarioSchema = Schema({
    nombre: { type: String, lowercase: true },
    apellido: { type: String, lowercase: true },
    correo: String,
    telefono: String,
    contrasena: String,
    imagen: String,
    rol: String,
    area: String,
    cargo: String,
    proyecto: String,
    dni: String,
    fechanacimiento: String,
    estado: String,
    pais: String,
    direccion: String
});

module.exports = mongoose.model('Usuario', usuarioSchema);