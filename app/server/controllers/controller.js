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
    console.log('hello?');
    // pull up the poll data using the nonce
    Poll.findOne({ 'permalink': req.path.slice(6) }).exec((err, poll) => {
      if (err) throw err;
      if (!poll) throw err;
      else {
        // tease out data first..
        const creator = poll._creator;
        const voteCount = poll.options.map(x => x.voteCount);
        const optionText = poll.options.map(x => x.optionText);

        // ideas for passing chart js data to client:
        // 1. if pug allows for crafting a javascript segment, then this would be the best option, but it appears that this cannot be done..(it's not recommended to make a JS segment using an HTML templater)
        // 2. write code here and somehow append to the body of the template? Is this possible?
        // 3. Ajax call query of the data from the server? It's not like I can't pass the data to the served page; it's just that I can't seem to make use of it without explicitly having it show up on the page somewhere.

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
        // render the page then populate with chart after? need the HTML hook..
        // data can be passed through local variables but charting it seems to require that the data be present on the page before it can be charted
        // that or, I need to generate a dynamic pug file that becomes modified based on this, then is rendered...
        // this would solve the direction from server to user, but what about user to server?
        // clicks would generate ajax calls (problem with this approach is that it's only 1 person)
        // socket io can make it real time. if using sockets, no need to do the dynamic pug page, I don't think.
        // two checks:
        // owner? Yes -> have delete poll option
        // authenticated user? Yes -> have add option option

        console.log('Retrieving poll...');
        console.log(creator);
       // console.log(req.user.id);
        console.log(voteCount);
        console.log(optionText);

        const permalink = req.protocol + '://' + req.get('host') + req.originalUrl; // for allowing the copy paste function

        console.log('permalink: ' + permalink);

        if (req.isAuthenticated()) {
          if (req.user.id && req.user.id === creator) {
            res.render('poll', { owner: 'true', loggedIn: 'true', permalink: permalink, path: 'poll' });
          }
          else res.render('poll', { owner: 'false', loggedIn: 'true', permalink: permalink, path: 'poll' });
        }
        else res.render('poll', { owner: 'false', loggedIn: 'false', permalink: permalink, path: 'poll' });
        
        /*

        if (req.isAuthenticated()) {  
          res.render('poll', { loggedIn: 'true', path: 'poll', voteCount: voteCount, optionText: optionText, title: poll.title });
        }
        else {
          res.render('poll', { loggedIn: 'false', path: 'poll', voteCount: voteCount, optionText: optionText, title: poll.title });

        }

        */
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
