'use strict'
let con = require('./connect_mongo');

let personal_json = {
    nombre: {type: String, lowercase: true },
    cargo: {type: String, lowercase: true }
};

let personal_schema = new con.Schema(personal_json, { collection: 'personal'});
let Personal = con.mongoose.model('Personal', personal_schema);

module.exports.Personal = Personal;
