const PIETYPE = {
    BASIC: {
        color: "#FBA312",
        title: "Basic courses"
    },
    MAJOR: {
        color: "#00A2ED",
        title: "Major courses"
    },
    USE: {
        color: "#24357F",
        title: "USE courses"
    },
    FREE: {
        color: "#BB0000",
        title: "Free courses"
    },
    SPECIALIZATION: {
        color: "#FDEC00",
        title: "Specialization courses"
    }
}

const db = require('../db/db.js');
var customFunc = require('./customFunctions.js');
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

        app.get('/filter', (req, res) => {
            res.render('filter.html');
        });

        app.get('/program/*', (req, res) => {
            res.render('program.html', {
                years: [
                    [
                        {
                            type: PIETYPE.BASIC,
                            percent: 1 / 12 * 4
                        },
                        {
                            type: PIETYPE.MAJOR,
                            percent: 1 / 12 * 5
                        },
                        {
                            type: PIETYPE.FREE,
                            percent: 1 / 12 * 2
                        },
                        {
                            type: PIETYPE.SPECIALIZATION,
                            percent: 1 / 12
                        }
                    ],
                    [
                        {
                            type: PIETYPE.BASIC,
                            percent: 1 / 12
                        },
                        {
                            type: PIETYPE.MAJOR,
                            percent: 1 / 12 * 4
                        },
                        {
                            type: PIETYPE.USE,
                            percent: 1 / 12 * 4
                        },
                        {
                            type: PIETYPE.SPECIALIZATION,
                            percent: 1 / 12 * 3
                        }
                    ]
                ],
                pieChart: function () {
                    return customFunc.pieChart(this)
                }
            });
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
