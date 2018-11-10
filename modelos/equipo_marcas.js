'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var equipo_marca_Schema = Schema({
    codigo: String,
    descripcion: String,
    avatar: String,
    observacion: String,
    usuario: { type: Schema.ObjectId, ref: 'Usuario'},
    pc: String,
    fechacreacion: Date,
    fechamodificacion: Date
});

module.exports = mongoose.model('Marca', equipo_marca_Schema);