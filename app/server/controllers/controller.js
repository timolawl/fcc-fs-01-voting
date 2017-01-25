'use strict'

const uuid = require('node-uuid');

//const User = require('../models/user');
const Poll = require('../models/poll');


function controller () {
  this.createpoll = (req, res) => {
    const newPoll = new Poll();
    newPoll._creator = req.user.id;
    newPoll.title = req.body.name;
    let optionsLength = req.body.options.length;
    for (let i = 0; i < optionsLength; i++) {
      newPoll.options.push({ text: req.body.options[i] });
    }
    newPoll.permalink = uuid.v4();

    newPoll.save(err => {
      if (err) throw err;
      done(null, newPoll);
    });
    
    Poll.find({}, (err, polls) => {
      if (err) throw err;
      console.log(polls);
      console.log(req.user.id);
      console.log(req.body);
    });

  };
 /* 
  this.checkUnique = (req, res) => {
      Poll.findOne({
  };
*/
}

module.exports = controller;
