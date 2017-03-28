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
};

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

        app.get('/filter', (req, res) => {
            res.render('filter.html');
        });

        app.get('/city', (req, res) => {
                    res.render('city-information.html');
                });

        app.get('/ietsleuks', (req, res) => {
            res.render('default.html', {
                heading: "Truuske is jarig!",
                content: "<img src='//lorempixel.com/600/400/' /> <p> There is something about parenthood that gives us a sense of history and a deeply rooted desire to send on into the next generation the great things we have discovered about life. And part of that is the desire to instill in our children the love of science, of learning and particularly the love of nature. Your fascination with the universe and how to explore it as we so often do in the field of astronomy can be highly academic and dry as maybe it was if you took a course in astronomy. But when you get out there in the field at night, your equipment is just right and the night sky comes alive with activity, there is no other experience like it for majesty and pure excitement. And that is the kind of experience we want our children to come to love as much as we do.</p><figure><img src='//lorempixel.com/600/400'/><figcaption>Dit is een heel mooi konijn, punt</figcaption></figure><p>There is something about parenthood that gives us a sense of history and a deeply rooted desire to send on into the next generation the great things we have discovered about life. And part of that is the desire to instill in our children the love of science, of learning and particularly the love of nature. Your fascination with the universe and how to explore it as we so often do in the field of astronomy can be highly academic and dry as maybe it was if you took a course in astronomy. But when you get out there in the field at night, your equipment is just right and the night sky comes alive with activity, there is no other experience like it for majesty and pure excitement. And that is the kind of experience we want our children to come to love as much as we do.</p>"
            });
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
