'use strict'

//modulos
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');

//modelos
var Usuario = require('../modelos/usuarios');

//servicio de jwt
var jwt = require('../servicios/jwt');

//acciones
function pruebas(req, res){
    res.status(200).send({
        message: 'Probando el controlador de usuarios y la accion de pruebas',
        usuario: req.usuario
    });
}

function guardarUsuario(req, res){

    //Crear objeto usuario
    var usuario = new Usuario();

    //Recoger parametros peticion
    var params = req.body;

    if(params.contrasena && params.nombre && params.apellido && params.correo && params.telefono){
        
        //Asignar valores al objeto de usuario
        usuario.nombre = params.nombre;
        usuario.apellido = params.apellido;
        usuario.correo = params.correo;
        usuario.telefono = params.telefono;
        usuario.area = null;
        usuario.cargo = null;
        usuario.proyecto = 'Consorcio DEMO SAC';
        usuario.dni = null;
        usuario.fechanacimiento = null;
        usuario.estado = null;
        usuario.pais = null;
        usuario.direccion = null;

        usuario.rol = 'ROL_USER';
        usuario.imagen = null;

    //Comprobar si el usuario esta registrado en la DB
    Usuario.findOne({correo: usuario.correo.toLowerCase()}, (err, comprobarusuario) => {
        if(err){
            res.status(500).send({message: 'Error al comprobar el usuario'});
        }else{
            if(!comprobarusuario){
                        //Cifrar contraseña
                        bcrypt.hash(params.contrasena, null, null, function(err, hash){
                            usuario.contrasena = hash;

                            //Guardar usuario en BD
                            usuario.save((err, userStored) => {
                                if(err){
                                    res.status(500).send({message: 'Error al guardar el usuario'});
                                }else{
                                    if(!userStored){
                                        res.status(404).send({message: 'No se ha registrado el usuario'});
                                    }else{
                                        res.status(200).send({usuario:userStored});
                                    }
                                }
                            });
                        });
            }else{
                res.status(200).send({
                    message: 'El usuario no puede registrarse - Ya existe en la base de datos'
                });  
            }
        }
    });


    }else{
    res.status(200).send({
        message: 'Introduce los datos correctamente para poder registrar al usuario'
    });
    }
 }

//Creamos metodo Login
function login(req, res){
    //Comprobar parametros para ver si el usuario existe
    var params = req.body;

    var correo = params.correo;
    var contrasena = params.contrasena;

    Usuario.findOne({correo: correo.toLowerCase()}, (err, usuario) => {
        if(err){
            res.status(500).send({message: 'Error al comprobar el usuario'});
        }else{
            if(usuario){
            bcrypt.compare(contrasena, usuario.contrasena, (err, check) => {
                if(check){

                    //comprobar y generar token
                    if(params.gettoken){
                        //devolver token jwt
                        res.status(200).send({
                            token: jwt.creacionToken(usuario)
                        });
                    }else{
                        res.status(200).send({usuario}); 
                    }
                  
                }else{
                    res.status(404).send({
                        message: 'El usuario no realizo login correctamente'
                    });
                }
            });
                
            }else{
                res.status(404).send({
                    message: 'El usuario no existe desde AP'
                });
            }
        }
    });
}

//Metodo actualizar usuario
function actualizarUsuario(req, res){
    var usuarioId = req.params.id;
    var update = req.body;
    delete update.contrasena;

    if(usuarioId != req.usuario.sub){
        return res.status(500).send({message: 'No tienes permiso para actualizar el usuario'});
    }

    Usuario.findByIdAndUpdate(usuarioId, update, {new:true},(err, actualizarUsuario) => {
        if(err){
        res.status(500).send({
            message: 'Error al actualizar usuario'
        });
        }else{
            if(!actualizarUsuario){
                res.status(404).send({message:'No se ha podido actualizar el usuario'});
            }else{
                res.status(200).send({usuario: actualizarUsuario})
            }
        }
    });

}

//Metodo subir Avatar/Imagen
function subirImagen(req, res){
    var usuarioId = req.params.id;
    var file_name = 'No subido...';

    if(req.files){
        var file_path = req.files.imagen.path;
        var file_split = file_path.split('/');        
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){

            if(usuarioId != req.usuario.sub){
                return res.status(500).send({message: 'No tienes permiso para actualizar la avatar'});
            }
        
            Usuario.findByIdAndUpdate(usuarioId, {imagen: file_name}, {new:true},(err, actualizarUsuario) => {
                if(err){
                res.status(500).send({
                    message: 'Error al actualizar avatar'
                });
                }else{
                    if(!actualizarUsuario){
                        res.status(404).send({message:'No se ha podido actualizar el avatar'});
                    }else{
                        res.status(200).send({usuario: actualizarUsuario, imagen: file_name});
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

//metodo para mostrar imagen en explorador
function getImagenFile(req, res){
    var imagenFile = req.params.imagenFile;
    var path_file = './subir/usuarios/'+imagenFile;
    
    fs.exists(path_file, function(exists){
        if(exists){
            res.sendFile(path.resolve(path_file));
        }else{
            res.status(404).send({message:'La imagen no existe'});
        }
    });
}

//metodo para listar usuarios con el rol ADMIN
function getListarUsuarios(req, res){ 
    Usuario.find({rol:'ROL_ADMIN'}).exec((err, usuario) => {
       if(err){
           res.status(500).send({message: 'Error en la peticion'});
       }else{
           if(!usuario){
            res.status(404).send({message: 'No hay cuidadores'});
           }else{
            res.status(200).send({usuario}); 
           }
       }
    });
}

module.exports = {
    pruebas,
    guardarUsuario,
    login,
    actualizarUsuario,
    subirImagen,
    getImagenFile,
    getListarUsuarios
};