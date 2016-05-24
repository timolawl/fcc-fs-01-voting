module.exports = {
    dbURL: process.env.MONGO_URL || 'mongodb://localhost:27017/timolawlvoting1',
    sessionSecret: process.env.SESSION_SECRET
};
