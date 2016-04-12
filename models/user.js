var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    _id: Number, // used to reference the polls
    userID: String,
    ipAddress: String,
    pollsCreated: [{ type: mongoose.Types.ObjectId, ref: 'Poll' }]
});

module.exports = mongoose.model('User', userSchema);
