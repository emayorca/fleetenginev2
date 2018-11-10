'use strict'

//modulos
var fs = require('fs');
var path = require('path');

//modelos
var Usuario = require('../modelos/usuarios');
var Equipo_marca = require('../modelos/equipo_marcas');

//acciones
function pruebas(req, res){
    res.status(200).send({
        message: 'Probando el controlador de  marcas de equipos y la accion de pruebas',
        usuario: req.usuario
    });
}

//Metodo guardar marca
function guardarMarca(req, res){
    var marca = new Equipo_marca();

    var params = req.body;

    if(params.codigo){
        marca.codigo = params.codigo;
        marca.descripcion = params.descripcion;
        marca.avatar = null;
        marca.observacion = params.observacion;
        marca.usuario = req.usuario.sub;
        marca.pc = params.pc;
        marca.fechacreacion = params.fechacreacion;
        marca.fechamodificacion = params.fechamodificacion;
        marca.anofabricacion = params.anofabricacion;
       
        marca.save((err, marcaStored) => {
            if(err){
                res.status(500).send({message: 'Error en el servidor'});
            }else{
                if(!marcaStored){
                    res.status(404).send({message: 'No se guardo la marca'});
                }else{
                    res.status(200).send({marca: marcaStored});
                }
            }
        });

    }else{
        res.status(200).send({
            message: 'El codigo de la marca es obligatorio'
        });
    }
}

//Metodo listar todas las Marcas
function getMarcas(req, res){
    Equipo_marca.find({}).populate({path: 'usuario'}).exec((err, marcas) => {
        if(err){
            res.status(500).send({
                message: 'Error en la peticion'
            });
        }else{
            if(!marcas){
                res.status(404).send({
                    message: 'No hay equipos'
                });
            }else{
                res.status(200).send({
                    marcas
                });
            }
        }
    });
}

//Metodo para listar una sola marca
function getMarca(req, res){
    var marcaId = req.params.id;

    Equipo_marca.findById(marcaId).populate({path: 'usuario'}).exec((err, marca) => {
        if(err){
            res.status(500).send({
                message: 'Error en la peticion'
            });
        }else{
            if(!marca){
                res.status(404).send({
                    message: 'El marca no existe'
                });
            }else{
                res.status(200).send({
                    marca
                });
            }
        }
    });
}

//Metodo para actualizar Marca
function actualizarMarca(req, res){
    var marcaId = req.params.id;
    var actualizar = req.body;

    Equipo_marca.findByIdAndUpdate(marcaId, actualizar, {new:true}, (err, sactualizarmarca) => {
        if(err){
            res.status(500).send({
                message: 'Error en la peticion'
            });
        }else{
            if(!sactualizarmarca){
                res.status(404).send({
                    message: 'No se actualizo la marca'
                });
            }else{
                res.status(200).send({marca: sactualizarmarca});
            }
        }
    });
}

//Metodo subir Fotografia/Imagen del equipo 
function subirImagen(req, res){
    var marcaId = req.params.id;
    var file_name = 'No subido...';

    if(req.files){
        var file_path = req.files.avatar.path;
        var file_split = file_path.split('\\');        
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){

            Equipo_marca.findByIdAndUpdate(marcaId, {avatar: file_name}, {new:true},(err, actualizarMARCA) => {
                if(err){
                res.status(500).send({
                    message: 'Error al actualizar Avatar de Marca'
                });
                }else{
                    if(!actualizarMARCA){
                        res.status(404).send({message:'No se ha podido actualizar el Avatar de la Marca'});
                    }else{
                        res.status(200).send({marcasss: actualizarMARCA, avatar: file_name});
                    }
                }
            });

        }else{
            fs.unlink(file_path, (err) => {
                if(err){
                    res.status(200).send({message:'Extension no valida y fichero no borrado'});
                }else{
                    res.status(200).send({message:'Extension no valida'});
                }
            });
          
        }    
        
    }else{
        res.status(200).send({message:'No se han subido archivos'});
    }
}

//Exportar el modulo
module.exports = {
    pruebas,
    guardarMarca,
    getMarcas,
    getMarca,
    actualizarMarca,
    subirImagen,
};