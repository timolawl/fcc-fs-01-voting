module.exports = {
    database: process.env.MONGO_URL || 'mongodb://localhost:27017/timolawlvoting',
    clientKey: process.env.API_KEY,
    clientSecret: process.env.API_SECRET
};
