let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/sistema_mantenimiento');

let Schema = mongoose.Schema;

module.exports = {
	Schema: Schema,
	mongoose: mongoose
};
