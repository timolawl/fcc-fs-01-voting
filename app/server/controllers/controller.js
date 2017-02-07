'use strict'

const uuid = require('node-uuid'); // nonce creation

//const User = require('../models/user');
const Poll = require('../models/poll');


function controller () {
  this.createpoll = (req, res) => {
    const newPoll = new Poll();
    newPoll._creator = req.user.id;
    newPoll.title = req.body.name;
    let optionsLength = req.body.options.length;
    for (let i = 0; i < optionsLength; i++) {
      newPoll.options.push({ optionText: req.body.options[i], voteCount: 0 });
    }
    newPoll.permalink = uuid.v4();

    console.log(newPoll._creator);
    console.log(newPoll.title);
    console.log(newPoll.options);
    console.log(newPoll.permalink);

    newPoll.save(err => {
      if (err) throw err;
     //  done(null, newPoll);
    });

    res.redirect('/' + newPoll.permalink); // , { permalink: newPoll.permalink });

/*
        
    Poll.find({}, (err, polls) => {
      if (err) throw err;
      console.log(polls);
      console.log(req.user.id);
      console.log(req.body);
    });


*/

  };

  this.renderpoll = (req, res) => {
    // pull up the poll data using the nonce
    Poll.findOne({ 'permalink': req.path.slice(1) }).exec((err, poll) => {
      if (err) throw err;
      if (!poll) throw err;
      else {
        // tease out data first..
        const voteCount = poll.options.map(x => x.voteCount);
        const optionText = poll.options.map(x => x.optionText);
/*
        const data = {
          labels: optionText,
          datasets: [
            {
              data: voteCount
            }
          ]
        };
        */
        // need to actually move this to client-side because chart js is for client rendering
        // render the page then populate with chart after? need the HTML hook...
        res.render('poll', { path: 'poll', voteCount: voteCount, optionText: optionText, title: poll.title });
        // get HTML hook
        /*
        const ctx = document.getElementById('freshPoll');
        const myChart = new Chart(ctx, {
          type: 'pie',
          data: data,
          options: {
            title: {
              text: poll.title
            }
          }
        });
        */
      }
    });

  };


 /* 
  this.checkUnique = (req, res) => {
      Poll.findOne({
  };
*/
}

module.exports = controller;
