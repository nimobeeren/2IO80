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
        app.get('/api/correct/:word', () => {
        });

        app.get('/', (req, res) => {
            res.render('index.html', {title: 'Study guide TU/e'});
        });

        app.get('/styleguide', (req, res) => {
            res.render('styleguide.html');
        });

        app.get('/search', (req, res) => {
            res.render('search.html');
        });

        app.get('/program', (req, res) => {
            res.render('filter.html', {title: 'Programs'});
        });

        app.get('/questionnaire', (req, res) => {
            res.render('questionnaire.html', {title: 'Questionnaire'});
        });

        app.get('/why-tue', (req, res) => {
            res.render('default.html', {
                title: "Why study at TU/e?",
                heading: "Why study at TU/e?",
                content: '<img height=133 src=https://static.tue.nl/fileadmin/_processed_/8/b/csm_logo01_4c920aa3e4.jpg style=float:right width=200><p>Studying at TU/e means studying at a Dutch top university. A university with a unique Bachelor College and its own Graduate School.<p><strong>High ranking<br></strong>That’s evident from the high position of our university in national and international rankings.<br><br><strong>TU/e is a good choice</strong><br>It is not only the high independent ranking positions that make TU/e a good place to study. Studying at Eindhoven University of Technology means that you choose a university with top quality education and internationally prominent research.<br><br><strong>Personal contact</strong><br>TU/e is a medium-sized university with an open, friendly atmosphere where your studies are well supervised and where there is plenty of personal contact with lecturers and staff. Experienced TU/e coaches are by your side to offer personal advice from the very start of your study, from the moment you enroll at the Bachelor College when you and your coach look at the major that best suits you and how you can best supplement this with your electives. And if you should find out during your first year that a different major suits you better, then you can look at the options with your coach for switching major within this first year.<p><strong>International contacts</strong><br>TU/e offers you excellent facilities and there are many international contacts with leading universities. A period studying at a university abroad is one of the possibilities.<br><br><strong>TU/e and society</strong><br>‘Where innovation starts’ is the TU/e slogan for very good reasons. The university is meeting the societal challenges especially in the fields of health, energy and mobility. As a TU/e Master of Science graduate you have the prospect of a variable, challenging, lucrative and socially useful career.<p><strong>Top technology region<br></strong>TU/e lies in the top technology region of Brainport, the beating technological heart of the Netherlands. Relationships with high-tech companies and organizations in the region are many and good, and that bears fruit for you in your assignments, internships, graduation projects and work.<br><br><strong>Eindhoven student city<br></strong>Eindhoven is a modern, dynamic city that guarantees an enjoyable study period and varied student life. The vibrant spirit liveliness of Eindhoven along with the exuberant Brabant way of life will make you feel at home.<p><strong>Match-making event</strong><br>During the match-making event you get the opportunity to meet companies. International master students at Eindhoven University of Technology (TU/e) with an Amandus Lundqvist Scholarship Program (ALSP) are brought into contact with companies that participate in the ALSP program. If there is a match between you and a company you receive a scholarship from that company for your Master’s program at TU/e. After you graduate, you will be working for that company for 3 consecutive years.<p>Page composed with the free online HTML editor. Please subscribe for a license to remove these messages from the edited documents.<p>April Fools Day is coming. Prank your friends opening a never ending fake update screen on their computer. Sit back and watch their reaction.'
            });
        });

        app.get('/orientation-day', (req, res) => {
            res.render('default.html', {
                title: "Orientation Day!",
                heading: "Orientation Day!",
                content: "<img src='//lorempixel.com/600/400/' /> <p>There is something about parenthood that gives us a sense of history and a deeply rooted desire to send on into the next generation the great things we have discovered about life. And part of that is the desire to instill in our children the love of science, of learning and particularly the love of nature. Your fascination with the universe and how to explore it as we so often do in the field of astronomy can be highly academic and dry as maybe it was if you took a course in astronomy. But when you get out there in the field at night, your equipment is just right and the night sky comes alive with activity, there is no other experience like it for majesty and pure excitement. And that is the kind of experience we want our children to come to love as much as we do.</p><figure><img src='//lorempixel.com/600/400'/><figcaption>Dit is een heel mooi konijn, punt</figcaption></figure><p>There is something about parenthood that gives us a sense of history and a deeply rooted desire to send on into the next generation the great things we have discovered about life. And part of that is the desire to instill in our children the love of science, of learning and particularly the love of nature. Your fascination with the universe and how to explore it as we so often do in the field of astronomy can be highly academic and dry as maybe it was if you took a course in astronomy. But when you get out there in the field at night, your equipment is just right and the night sky comes alive with activity, there is no other experience like it for majesty and pure excitement. And that is the kind of experience we want our children to come to love as much as we do.</p>"
            });
        });

        app.get('/info', (req, res) => {
            res.render('default.html', {
                title: "General Information",
                heading: "General Information",
                content: "<img src='/images/orientation.jpg' /><h2>Orientation Days</h2>" +
                "<p>Are you in the fifth or sixth year of your vwo (pre-university education), did you already visit an Information Day and would you like to find out what it's like to be a student for a day? Then join a student for a day of the program you're interested in. You'll attend lectures and instructions, visit labs and other practical lecturerooms and find your way around the campus of Eindhoven University of Technology. The dates of the Orientation days are set each year by the individual programs.</p>" +
                "<h2>Eindhoven as a city</h2>" +
                "<figure><img src='/images/eindhoven.jpg'/><figcaption>Dit is een heel mooi konijn, punt</figcaption></figure>" +
                "<p>Eindhoven is now number one in terms of technology with a strategic position as one of Western Europe’s leading technology centers and the base of the research and development facilities of Royal Philips Electronics. Many other global companies have established research, development and production facilities in the Eindhoven area. Due to Philips - and because of the various projects involving lighting up city buildings - Eindhoven has become known as the City of Light.</p>" +
                "<h2>Apply for a course</h2><p>TU/e offers students various Bachelor and Master programs. We educate engineers whose scientific basis is solid and penetrative and who have an entrepreneurial attitude. We offer different kinds of approaches: inspiring lectures, small-scale instruction, supervised self-study and Design-Based Learning (DBL) during which you work in small teams on technology design assignments. You will have practical internships and do graduation projects in industry or government. As a TU/e student you not only gain thorough scientific knowledge but also learn to apply this knowledge in practice as well as develop social and communication skills. During your Bachelor program you also get the opportunity to cross over the borders of your own subject through the major-minor system.</p>"
            });
        });

        app.get('/program-pt', (req, res) => {
            res.render('program-pt.html');
        });
        app.get('/program-wt', (req, res) => {
            res.render('program-wt.html');
        });
        app.get('/program-hti', (req, res) => {
            res.render('program-hti.html');
        });
        app.get('/program-cse', (req, res) => {
            res.render('program-cse.html');
        });
        app.get('/program/*', (req, res) => {
            res.render('program.html');
        });

        app.get('*', (req, res) => {
            let success = false;
            db.query(db => {
                db.collection('search').find({url: new RegExp(req.path.slice(1), 'gi')}).forEach(obj => {
                    if (obj.url.replace("https://studyguide.tue.nl/", '') === req.path.slice(1)) {
                        obj.contents = obj.contents.replace(/&#xA0;/i, '');
                        if (obj.contents.includes(obj.title)) {
                            obj.contents = obj.contents.replace(new RegExp(obj.title, 'i'), '');
                        }
                        obj.headings.forEach(heading => {
                            obj.contents = obj.contents.replace(new RegExp(heading, 'g'), "<h2>" + heading + "</h2>");
                        });
                        !success && res.render("default.html", {
                            title: obj.title,
                            content: obj.contents,
                            heading: obj.title
                        });
                        success = true;
                    }
                }, () => {
                    !success && res.status(404).send("404");
                })
            });
        });
    }
};
