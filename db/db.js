const db = require('mongodb').MongoClient;

const url = 'mongodb://admin:admin@ds151049.mlab.com:51049/heroku_0q1w06bh';

module.exports = {
    query: (callback) => db.connect(url, (err, db) => {
        !err && callback(db);
    })
};

module.exports.query(db => {
    db.collection("search").insertOne({
        contents: "<div id='c5054'><div class='ce-textpic ce-right ce-intext'><div class='ce-gallery' data-ce-columns='1' data-ce-images='1'><div class='ce-row'><div class='ce-column'><div class='ce-media'><img src='https://static.studiegids.tue.nl/fileadmin/_processed_/f/a/csm_PT_picture_73de215444.jpg' width='200' height='150' alt=''/> </div></div></div></div><div class='ce-bodytext'><p>Major coursesHalf of the three-year Bachelor’s program is made up by your Major, which forms the basis of your study program. If you choose the Psychology &amp; Technology Major, you’ll combine courses in psychology and technology subjects. The technology courses are in ICT, Built Environment or Robotics. On average you’ll spend a third of your time on technology subjects, a third on psychology subjects and a third on research methods and practical assignments.</p><p><strong>Elective courses</strong><br/>A quarter of the Bachelor’s program consists of elective courses that you can choose yourself. These allow you to change the emphasis in your program. You can opt to broaden your knowledge by following courses in a different specialization, or alternatively you can gain more in-depth knowledge in your own specialization.<br/>&nbsp;<br/><strong>Basic courses</strong><br/>As well as your Major you’ll follow a number of basic courses such as mathematics and natural sciences. You’ll also learn technological design, and you’ll gain professional skills like teamworking and organization. These courses will give you the sound basis that you’ll need as an engineer.</p><p><strong>USE courses</strong><br/>Finally you choose USE (User, Society and Enterprise) courses. These show you that technology always functions in a broader context. Engineers develop technology for users, to contribute to solving societal problems and to create economic opportunities for enterprises.</p></div></div></div>",
        title: "Major Psychology & Technology",
        program: "Psychology & Technology",
        headings: [],
        faculty: "Psychology & Technology",
        degree: "Bachelors BSc",
        url: "/programs/bachelor-college/majors/psychology-technology"
    });
});
