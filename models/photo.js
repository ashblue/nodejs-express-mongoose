var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/adnc_app'); // Connect at localhost and use adnc_app as database

var schema = new mongoose.Schema({
    name: String,
    path: String
});

module.exports = mongoose.model('Photo', schema);