'use strict'
let con = require('./connect_mongo');

let equipo_json = {
    codigo: String,
    codigoauxiliar: String,
    placa: String,
    serie: String,
    marca: String,
    modelo: String,
    anofabricacion: Number,
    flota: String,
    tipo: String,
    estado: String,
    proyecto: String,
    frente: String,
    year: Number,
    propietario: String,
    observacion: String,
    fotografia: String,
    usuario: { type: con.Schema.ObjectId, ref: 'Usuario'},
    controles: [{
        _id: con.Schema.Types.ObjectId,
        nombre: String,
        historial: [{
            id: con.Schema.Types.ObjectId,
            nuevo: Boolean,
            turno: String,
            fecha: Date,
            inicial: Number,
            diferencia: Number,
            final: Number,
            total: Number,
            frente_trabajo: String,
            observacion: String,
            adjunto: String,
            id_usuario: String,
            operador: String,
            id_operador: String,
            equipo_autorizado: String,
            fecha_gestion: Date,
            proyecto: String,
            ubicacion: String,
        }]
    }]
};

let equipo_schema = new con.Schema(equipo_json);
let Equipo = con.mongoose.model('Equipo', equipo_schema);

module.exports.Equipo = Equipo;
