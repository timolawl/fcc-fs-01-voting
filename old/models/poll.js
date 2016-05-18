var mongoose = require('mongoose');

var pollSchema = new mongoose.Schema({
    _creator: { type: Number, ref: 'User' }, // used to reference the poll creator
    name: { type: String, required: true, unique: true, index: true },
    options: [{ name: String, votes: Number }],
    voters: [{ type: Number, ref: 'User' }]
});

module.exports = mongoose.model('Poll', pollSchema);
