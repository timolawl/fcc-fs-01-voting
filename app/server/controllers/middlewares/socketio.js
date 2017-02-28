'use strict';

const Poll = require('../../models/poll');

module.exports = io => {

  

  io.on('connection', function(socket) {
    console.log('test socket');
    var userID = socket.request.session.passport.user;
    console.log(`Your user ID is ${userID}`);
  /*
    socket.on('submit', function (data) {
      console.log(data);
    });
  */

    // problem with this approach is that a client is on a page that doesn't require rooms, client remains connected to an old room...
    // perhaps the proper approach is to leave any rooms upon joining the non-room pages
    //

    socket.on('leave room', function (data) {
      if (socket.room !== undefined)
        socket.leave(socket.room);
      console.log('now in: ' + data.path);
    });

    socket.on('change room', function (data) {
      if (socket.room !== undefined)
        socket.leave(socket.room);
      socket.room = data.room;
      socket.join(socket.room);
      console.log('now in: ' + socket.room);
    });
    
    socket.on('add vote', function (data) {
      Poll.findOne({ 'permalink': data.path }).exec((err, poll) => {
        if (err) throw err;
        if (!poll) throw err;
        else {
          // get the correct option
          for (let i = 0; i < poll.options.length; i++) {
            if (poll.options[i].optionText === data.vote) {
              poll.options[i].voteCount++;
              poll.save(err => {
                if (err) throw err;
              });
              break;
            }
          }

          console.log('joined room: ' + data.path);
          // http://stackoverflow.com/questions/10058226/send-response-to-all-clients-except-sender-socket-io
          io.in(data.path).emit('update poll', { pollOptions: poll.options });
          console.log('data should have been emitted...');
        }
      });
    });

  });
};
