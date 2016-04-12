var mongoose = require('mongoose');

var pollSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, index: true },
    options: [{ name: String, votes: Number }]
});

module.exports = mongoose.model('Poll', pollSchema);
