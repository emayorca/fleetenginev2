'use strict'
let con = require('./connect_mongo');

let ubicacion_json = {
    UBIGEO: String,
    DEPARTAMENTO: String,
    PROVINCIA: String,
    DISTRITO: String
};

let ubicacion_schema = new con.Schema(ubicacion_json, { collection: 'ubigeo'});
let Ubicacion = con.mongoose.model('Ubigeo', ubicacion_schema);

module.exports.Ubicacion = Ubicacion;
