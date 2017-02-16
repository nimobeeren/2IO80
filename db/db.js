const db = require('mongodb').MongoClient;

const url = 'mongodb://admin:admin@ds151049.mlab.com:51049/heroku_0q1w06bh';

module.exports = {
    query: (callback) => db.connect(url, (err, db) => {
        !err && callback(db);
    })
};
