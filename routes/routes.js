const db = require('../db/db.js');

module.exports = {
    use: (app, express, db) => {
        app.use(express.static('public'));

        app.get('/api/cache', (req, res) => {
            const cache = [];
            if (cache.length == 0) {
                db.query(db => {
                    db.collection("search").find().forEach(page => cache.push(page), () => {
                        res.send(cache);
                    });
                });
            } else {
                res.send(cache);
            }
        });

        app.get('*', (req, res) => {
            res.sendfile("views/" + req.originalUrl);
        });
    }
};
