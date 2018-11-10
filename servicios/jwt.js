'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'Clave_secreta_del_sistema_mantenimiento_angular4';

exports.creacionToken = function(usuario){
    var payload = {
        sub: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        rol: usuario.rol,
        imagen: usuario.imagen,
        fechaini: moment().unix(),
        fechaexpi: moment().add(30, 'days').unix
    };

    return jwt.encode(payload, secret);
};