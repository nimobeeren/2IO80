const db = require('../db/db.js');
let customFunc = require('./customFunctions.js');
let spellingCorrector = require("spelling-corrector");
spellingCorrector = new spellingCorrector();
spellingCorrector.loadDictionary();

module.exports = {
    use: (app, express, db) => {
        app.use(express.static('public'));

        app.get('/api/cache', (req, res) => {
            const cache = [];
            db.query(db => {
                db.collection("search").find().forEach(page => cache.push(page), () => {
                    res.send(cache);
                });
            });
        });
        app.param('word', (req, res, next, word) => {
            res.send(spellingCorrector.correct(word));
        });
        app.get('/api/correct/:word', () => {});

        app.get('/', (req, res) => {
            res.render('index.html');
        });

        app.get('/styleguide', (req, res) => {
            res.render('styleguide.html');
        });

        app.get('/search', (req, res) => {
            res.render('search.html');
        });

        app.get('/program', (req, res) => {
            res.render('filter.html');
        });

        app.get('/questionnaire', (req, res) => {
            res.render('questionnaire.html');
        });

        app.get('/program/*', (req, res) => {
            let success = false;
            db.query(db => {
                db.collection('pages').find({url: req.path}).forEach(obj => {
                    // get referenced alternate
                    var alternate = typeof obj.alternate == 'object' ? db.collection('pages').find({ _id: {$in: obj.alternate}}).toArray() : null;
                    var masters = typeof obj.masters == 'object' ? db.collection('pages').find({ _id: {$in: obj.masters}}).toArray() : null;

                    Promise.all([alternate, masters]).then(values => {
                        obj.alternate = values[0];
                        obj.masters = values[1];
                        obj.genPieChart = function () {
                            return customFunc.pieChart(this)
                        };

                        !success && res.render("program.html", obj);
                        success = true;
                        }, reason => {
                    });
                }, () => {
                    // todo: redirect to 404
                    // !success && res.status(404).send("404");
                })
            });
        });

        app.get('*', (req, res) => {
            let success = false;
            db.query(db => {
                db.collection('search').find({url: new RegExp(req.path.slice(1), 'gi')}).forEach(obj => {
                    !success && res.render("default.html", {
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
