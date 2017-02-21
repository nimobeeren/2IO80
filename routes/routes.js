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

        app.get('/', (req, res) => {
            res.render('index.html');
        });

        app.get('/search', (req, res) => {
            res.render('search.html');
        });

        app.get('*', (req, res) => {
            let success = false;
            db.query(db => {
                db.collection('search').find({url: new RegExp(req.path.slice(1), 'gi')}).forEach(obj => {
                    !success && res.render("page.html", {
                        title: obj.title,
                        contents: obj.contents,
                        headings: obj.headings
                    });
                    success = true;
                }, () => {
                    !success && res.status(404).send("404");
                })
            });
        });
    }
};
