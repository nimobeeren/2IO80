const db = require('../db/db.js');

module.exports = {
    use: (app, express, db) => {
        app.use(express.static('public'));

        app.get('/api/cache', (req, res) => {
            const cache = [];
            res.header("Cache-Control", "no-cache");
            if (cache.length == 0) {
                db.query(db => {
                    db.collection("search").find().forEach(page => cache.push(page), () => {
                        res.status(200).send(cache);
                    });
                });
            } else {
                res.status(200).send(cache);
            }
        });

        app.get('*', (req, res) => {
            res.sendfile("views/home.html");
        });
    }
};
