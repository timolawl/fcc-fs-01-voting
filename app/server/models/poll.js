'use strict';

const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
    _creator: { type: Number, ref: 'User' },
    title: { type: String, required: true },
    options: [{ type: mongoose.Schema.ObjectId, ref: 'Option' }],
    permalink: { type: String, unique: true, required: true }
});

const optionSchema = new mongoose.Schema({
    _poll: { type: String, ref: 'Poll' },
    text: { type: String, required: true, unique: true },
    voteCount: { type: Number, default: 0 }
});

const Option = mongoose.model('Option', optionSchema);

module.exports = mongoose.model('Poll', pollSchema);
