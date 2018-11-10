'use strict'
var fs = require('fs');
var path = require('path');

//modelos
var Equipos = require('../modelos/equipos').Equipo;
var Ubicacion = require('../modelos/ubicaciones').Ubicacion;
var Personal = require('../modelos/personal').Personal;


function findCodigos( req, res ) {
    // return res.send( req.query.term );
    Equipos.find({codigo: { $regex: `.*${ req.query.term.toUpperCase() }.*`} }, function( err, docs ){
    	if(err) res.status( err.status || 500 ).json({ mensaje: 'Tuvimos un error inesperado '});
    	if(docs.length==0){
    		res.status(404).json({ mensaje: 'No encontramos coincidencias'});
    	} else {
    		let arr_resultados = [];
    		for (var i = 0; i < docs.length; i++) {
				//let value = `${docs[i].marca}(${docs[i].modelo}) ${docs[i].tipo}`;
				let value = `${docs[i].tipo}(${docs[i].codigo})`;
    			arr_resultados.push({ value: value, doc: docs[i]});
    		}
    		res.status(200).json( arr_resultados );
    	}
    })
}

function findPlacas(req, res) {
	// return res.send( req.query.term );
    Equipos.find({placa: { $regex: `.*${ req.query.term.toUpperCase() }.*`} }, function( err, docs ){
    	if(err) res.status( err.status || 500 ).json({ mensaje: 'Tuvimos un error inesperado '});
    	if(docs.length==0){
    		res.status(404).json({ mensaje: 'No encontramos coincidencias'});
    	} else {
    		let arr_resultados = [];
    		for (var i = 0; i < docs.length; i++) {
    			let value = `${docs[i].marca}(${docs[i].modelo}) ${docs[i].tipo}`;
    			arr_resultados.push({ value: value, doc: docs[i]});
    		}
    		res.status(200).json( arr_resultados );
    	}
    });
}

function findUbicacion(req, res) {
    Ubicacion.find({ DISTRITO: { $regex: `.*${ req.query.term.toUpperCase() }.*`} }, function( err, docs ){
    	if(err) res.status( err.status || 500 ).json({ mensaje: 'Tuvimos un error inesperado '});
    	if(docs.length==0){
    		res.status(404).json({ mensaje: 'No encontramos coincidencias'});
    	} else {
    		let arr_resultados = [];
    		for (var i = 0; i < docs.length; i++) {
    			let value = `PE, ${docs[i].DEPARTAMENTO}, ${docs[i].PROVINCIA} - ${docs[i].DISTRITO}`;
    			arr_resultados.push({ value: value, doc: docs[i]});
    		}
    		res.status(200).json( arr_resultados );
    	}
    });
}

function findOperador(req, res) {
    // Convertimos a minúsculas
    let term = req.query.term.toLowerCase();
    Personal.find({ nombre: { $regex: `.*${ term }.*`}, cargo: 'operador' }, function( err, docs ){
    	if(err) res.status( err.status || 500 ).json({ mensaje: 'Tuvimos un error inesperado '});
    	if(docs.length==0) {
    		res.status(404).json({ mensaje: 'No encontramos coincidencias'});
    	} else {
    		let arr_resultados = [];
            let arr_nombre_formateado = [];
            for (var i = 0; i < docs.length; i++) {
                let arr_nombre = `${docs[i].nombre}`.split(" ");
                for(var elem of arr_nombre ) {
                    arr_nombre_formateado.push(elem[0].toUpperCase() + elem.slice(1));
                }
                let value = arr_nombre_formateado.join(" ");
    			arr_resultados.push({ value: value, doc: docs[i]});
    		}
    		res.status(200).json( arr_resultados );
    	}
    });
}

function findEquipo(req, res) {
    
}

module.exports = {
    findCodigos,
    findPlacas,
    findUbicacion,
    findOperador,
    findEquipo
};