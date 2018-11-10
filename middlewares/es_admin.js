'use strict'

exports.esAdmin = function(req, res, next){
    if(req.usuario.rol != 'ROL_ADMIN'){
        return res.status(200).send({message: 'No tienes acceso a esta zona'});
    }

    next();
};