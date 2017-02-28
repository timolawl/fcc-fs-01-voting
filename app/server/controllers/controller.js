'use strict'

const uuid = require('node-uuid'); // nonce creation

//const User = require('../models/user');
const Poll = require('../models/poll');


function controller () {
  this.createpoll = (req, res, next) => {
    const newPoll = new Poll();
    newPoll._creator = req.user.id;
    newPoll.title = req.body.name;
    let optionsLength = req.body.options.length;
    for (let i = 0; i < optionsLength; i++) {
      newPoll.options.push({ optionText: req.body.options[i], voteCount: 0 });
    }
    newPoll.permalink = uuid.v4();

    
    console.log('New poll created:');
    console.log(newPoll._creator);
    console.log(newPoll.title);
    console.log(newPoll.options);
    console.log(newPoll.permalink);

    

    newPoll.save(err => {
      if (err) throw err;
     //  done(null, newPoll);
    });

    // it's not a render because the path changes; thus it must be a redirect..
    // question is, can I pass local variables through a redirect?
    // maybe this isn't necessary as it can always be queried from the db
    // but direct queries is not necessary as this individual is the creator.
    // still, a local variable passed saying that this poll was just created would help..
    res.redirect('/poll/' + newPoll.permalink); // , { permalink: newPoll.permalink });
    // the above option should go through the normal behavior of going through controller.renderpoll.. check to make sure later.
/*
        
    Poll.find({}, (err, polls) => {
      if (err) throw err;
      console.log(polls);
      console.log(req.user.id);
      console.log(req.body);
    });


*/

  };

  this.renderpoll = (req, res, next) => {
 //   console.log('hello?');
    // leave any previous rooms then join the current room


    // pull up the poll data using the nonce
    Poll.findOne({ 'permalink': req.path.slice(6) }).exec((err, poll) => {
      if (err) throw err;
      if (!poll) {
        // no poll exists at this permalink; redirect individual to 404 page.
        res.redirect('/404');
      }
      else {
        let voted = false;
        // tease out data first..
        const creator = poll._creator;
        const pollTitle = poll.title;
        const voteCount = poll.options.map(x => x.voteCount);
        const optionText = poll.options.map(x => x.optionText);
        const voters = poll.voters;


        // check if already voted:
        console.log(voters);
        console.log(voters.indexOf(req.user.id));
        if (voters.indexOf(req.user.id) > -1) {
          voted = true;
        }


        console.log('Retrieving poll...');
        console.log(voted);
        console.log('creator: ' + creator);
     //   console.log(pollTitle);
        console.log('req.user.id: ' + req.user.id);
     //   console.log(voteCount);
     //   console.log(optionText);

        const permalink = req.protocol + '://' + req.get('host') + req.originalUrl; // for allowing the copy paste function

        console.log('permalink: ' + permalink);

        if (req.isAuthenticated()) {
          if (req.user.id && req.user.id === creator) {
            res.render('poll', { owner: 'true', loggedIn: 'true', permalink: permalink, path: 'poll', optionText: optionText, voteCount: voteCount, pollTitle: pollTitle, voted: voted });
          }
          else res.render('poll', { owner: 'false', loggedIn: 'true', permalink: permalink, path: 'poll', optionText: optionText, voteCount: voteCount, pollTite: pollTitle, voted: voted });
        }
        else res.render('poll', { owner: 'false', loggedIn: 'false', permalink: permalink, path: 'poll', optionText: optionText, voteCount: voteCount, pollTitle: pollTitle, voted: voted });  
      }
    });

  };
/*
  this.updatepoll = (req, res) => {
    // socket io no room change as it is an update

    // on post on a poll page, do this:
    // two pieces of essential information is the submit type and the option.
    console.log('test');
    console.log('New option submitted: ' + req.body.option);
  };
*/
  this.deletepoll = (req, res, next) => {
    console.log(req.path);
    console.log('deleting poll!');
  
    Poll.findOneAndRemove({ 'permalink': req.path.slice(6) }).exec(err => {
      if (err) throw err;
      else console.log('poll deleted');
    });

    
    res.redirect('/')

  };


 /* 
  this.checkUnique = (req, res) => {
      Poll.findOne({
  };
*/
}

module.exports = controller;
