var mongoose = require('mongoose');
var imageSchema = new mongoose.Schema({
    name: String,
    img: String
});
 
module.exports = mongoose.model('Image', imageSchema);