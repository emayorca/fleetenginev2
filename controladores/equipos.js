'use strict'

//modulos
var fs = require('fs');
var path = require('path');


//modelos
var Usuario = require('../modelos/usuarios');
var Equipo = require('../modelos/equipos').Equipo;

//acciones
function pruebas(req, res){
    res.status(200).send({
        message: 'Probando el controlador de equipos y la accion de pruebas',
        usuario: req.usuario
    });
}

//Metodo guardar equipo
function guardarEquipo(req, res){
    var equipo = new Equipo();

    var params = req.body;

    if( params.codigo ) {
        equipo.codigo = params.codigo;
        equipo.codigoauxiliar = params.codigoauxiliar;
        equipo.placa = params.placa;
        equipo.serie = params.serie;
        equipo.marca = params.marca;
        equipo.modelo = params.modelo;
        equipo.anofabricacion = params.anofabricacion;
        equipo.flota = params.flota;
        equipo.tipo = params.tipo;
        equipo.estado = params.estado;
        equipo.ubicacion = params.ubicacion;
        equipo.proyecto = params.proyecto;
        equipo.frente = params.frente;
        equipo.propietario = params.propietario;
        equipo.observacion = params.observacion;
        equipo.fotografia = null;
        equipo.usuario = req.usuario.sub;

        equipo.save((err, equipoStored) => {
            if ( err ) {
                res.status(500).send({message: 'Error en el servidor'});
            } else {
                if(!equipoStored){
                    res.status(404).send({message: 'No se guardo el equipo'});
                }else{
                    res.status(200).send({equipo: equipoStored});
                }
            }
        });

    }else{
        res.status(200).send({
            message: 'El codigo del equipo es obligatorio'
        });
    }
}

//Metodo listar todos los equipos
function getEquipos(req, res){
    Equipo.find({}).populate({path: 'usuario'}).exec((err, equipos) => {
        if(err){
            res.status(500).send({
                message: 'Error en la peticion'
            });
        }else{
            if(!equipos){
                res.status(404).send({
                    message: 'No hay equipos'
                });
            }else{
                res.status(200).send({
                    equipos
                });
            }
        }
    });
}

//Metodo para listar solo un equipo
function getEquipo(req, res){
    var equipoId = req.params.id;

    Equipo.findById(equipoId).populate({path: 'usuario'}).exec((err, equipo) => {
        if(err){
            res.status(500).send({
                message: 'Error en la peticion'
            });
        }else{
            if(!equipo){
                res.status(404).send({
                    message: 'El equipo no existe'
                });
            }else{
                res.status(200).send({
                    equipo
                });
            }
        }
    });
}

//Metodo para actualizar Equipo
function actualizarEquipo(req, res){
    var equipoId = req.params.id;
    var actualizar = req.body;

    Equipo.findByIdAndUpdate(equipoId, actualizar, {new:true}, (err, AactualizarEquipo) => {
        if(err){
            res.status(500).send({
                message: 'Error en la peticion'
            });
        }else{
            if(!AactualizarEquipo){
                res.status(404).send({
                    message: 'No se actualizo el equipo'
                });
            }else{
                res.status(200).send({equipo: AactualizarEquipo});
            }
        }
    });
}

//Metodo subir Fotografia/Imagen del equipo 
function subirImagen(req, res){
    var equipoId = req.params.id;
    var file_name = 'No subido...';

    if(req.files){
        var file_path = req.files.fotografia.path;
        var file_split = file_path.split('/');        
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){

            //if(usuarioId != req.usuario.sub){
                //return res.status(500).send({message: 'No tienes permiso para actualizar imagen'});
            //}
        
            Equipo.findByIdAndUpdate(equipoId, {fotografia: file_name}, {new:true},(err, AactualizarEquipo) => {
                if(err){
                res.status(500).send({
                    message: 'Error al actualizar imagen de equipo'
                });
                }else{
                    if(!AactualizarEquipo){
                        res.status(404).send({message:'No se ha podido actualizar el imagen de equipo'});
                    }else{
                        res.status(200).send({equipo: AactualizarEquipo, fotografia: file_name});
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

//metodo para mostrar fotografia/imagen del equipo en explorador
function getImagenFile(req, res){
    var imagenFile = req.params.imagenFile;
    var path_file = './subir/equipos/'+imagenFile;
    
    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(404).send({message:'La imagen no existe'});
        }
    });
}

//Metodo borrar equipo
function borrarEquipo(req, res){
    var equipoId = req.params.id;

    Equipo.findByIdAndRemove(equipoId, (err, borradorEquipo) => {
        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        }else{
            if(!borradorEquipo){
                res.status(404).send({message: 'No se borro el equipo de la BDD'});
            }else{
                res.status(200).send({equipo: borradorEquipo});                
            }
        }
    });
}

  function getControles( req, res ) {
      Equipo.findOne({ '_id': req.params.id }, (err, doc) => {
          if(err) return res.send(err).status(500);
          return res.send(doc).status(202);
      });
  }

  function setControles( req, res ) {
      Equipo.update({ '_id': req.body.id }, {
          $push: {
              controles: { nombre: req.body.control }
          }
      }, function(err, respuesta){
          if(err) return err;
          res.send(respuesta)
      });
  };

// aquí recibimos toda la información a actualizar, incluídas las imágenes.
function mantenerControles( req, res){
  // if( err ) return "Hubo un error";
  // // console.log( req.files );
  // console.log( JSON.parse(req.body.objeto_equipo) );
  // console.log( JSON.parse(req.body.historial) );

  let objeto_equipo = JSON.parse(req.body.objeto_equipo);
  let historial = JSON.parse(req.body.historial);

  for( var i in historial ) {
    // Si no se han subido archivos entonces definimos la variable urlAdjunto como no registrado.
    if ( req.files.length === 0 ) {
      var urlAdjunto = "No registrado";
    } else {
    // Sino obtenemos el nombre del archivo que hemos subido.
    var urlAdjunto = req.files.find(x => x.originalname === historial[i].adjunto).filename;
    }

      Equipo.update({
        "_id": objeto_equipo.id_equipo,
        "controles._id": objeto_equipo.id_tipo_control
      },{
        $push: {
          'controles.$.historial': {
            nuevo: historial[i].nuevo,
            turno: historial[i].turno,
            fecha: historial[i].fecha,
            inicial: historial[i].inicial,
            final: historial[i].final,
            diferencia: historial[i].diferencia,
            total: historial[i].total,
            frente_trabajo: historial[i].frente_trabajo,
            observacion: historial[i].observacion,
            adjunto: urlAdjunto,
            ubicacion: objeto_equipo.id_ubicacion,
            id_usuario: objeto_equipo.id_usuario,
            operador: objeto_equipo.operador.toLowerCase(),
            id_operador: objeto_equipo.id_operador,
            equipo_autorizado: objeto_equipo.equipo_autorizado,
            fecha_gestion: objeto_equipo.fecha_gestion,
            proyecto: objeto_equipo.proyecto
          }
        }
      },
      {
        upsert: true, setDefaultsOnInsert: true
      },
      function (err, respuesta ) {
        console.log( respuesta )
      });
  }
  // Buscamos la información ingresada para actualizar el botón "Mostrar Registros"
  Equipo.find({
    "_id": objeto_equipo.id_equipo,
    "controles._id": objeto_equipo.id_tipo_control
  },
  function (err, doc ) {
    return res.send({ doc }).status(200);
  });
}

//Exportar el modulo
module.exports = {
    pruebas,
    guardarEquipo,
    getEquipos,
    getEquipo,
    actualizarEquipo,
    subirImagen,
    getImagenFile,
    borrarEquipo,

    setControles,
    getControles,
    mantenerControles
};