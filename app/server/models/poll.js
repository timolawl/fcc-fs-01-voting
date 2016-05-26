'use strict';

const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
    _creator: { type: Number, ref: 'User' },
    title: { type: String, required: true },
    options: [{ type: Schema.Types.ObjectId, ref: 'Option' }]
});

const optionSchema = new mongoose.Schema({
    _poll: { type: String, ref: 'Poll' },
    text: { type: String, required: true, unique: true }
    voteCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Poll', pollSchema);
