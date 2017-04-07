const express = require('express');
const app = express();
const server = require('http').createServer(app);
const db = require('./db/db.js');
const routes = require('./routes/routes.js').use(app, express, db);
const mustache = require('mustache-express');
const scraper = require('scraperjs');
const cheerio = require('cheerio');
const port = process.env.PORT || 80;

server.listen(port);

app.engine('html', mustache());
app.set('view engine', 'mustache');

console.log('Server running port:', port);

// Web Science URLs
const urls = [
'https://studyguide.tue.nl/programs/bachelor-college/majors/web-science/',
    'https://studyguide.tue.nl/programs/bachelor-college/majors/web-science/program-learning-objectives/',
    'https://studyguide.tue.nl/programs/bachelor-college/majors/web-science/curriculum/',
    'https://studyguide.tue.nl/programs/bachelor-college/majors/web-science/curriculum/basic-courses/',
    'https://studyguide.tue.nl/programs/bachelor-college/majors/web-science/curriculum/elective-courses-and-packages/',
    'https://studyguide.tue.nl/programs/bachelor-college/majors/web-science/coaching/',
    'https://studyguide.tue.nl/programs/bachelor-college/majors/web-science/professional-skills/',
    'https://studyguide.tue.nl/programs/bachelor-college/majors/web-science/bachelor-thesis/',
    'https://studyguide.tue.nl/programs/bachelor-college/majors/web-science/examination-schedules/',
    'https://studyguide.tue.nl/programs/bachelor-college/majors/web-science/graduation-deadlines/',
    'https://studyguide.tue.nl/programs/bachelor-college/majors/web-science/associate-master-programs/',
    'https://studyguide.tue.nl/programs/bachelor-college/majors/web-science/regulationsforms/',
    'https://studyguide.tue.nl/programs/bachelor-college/majors/web-science/advisors-tutors/',
    'https://studyguide.tue.nl/programs/bachelor-college/majors/web-science/contact/'
];

// P&T URLs
// const urls = [
//     'https://studyguide.tue.nl/programs/bachelor-college/majors/psychology-technology/',
//     'https://studyguide.tue.nl/programs/bachelor-college/majors/psychology-technology/school-of-innovation-sciences/',
//     'https://studyguide.tue.nl/programs/bachelor-college/majors/psychology-technology/school-of-innovation-sciences/education-administration-ieis/',
//     'https://studyguide.tue.nl/programs/bachelor-college/majors/psychology-technology/school-of-innovation-sciences/education-administration-ieis/registration-for-courses/',
//     'https://studyguide.tue.nl/programs/bachelor-college/majors/psychology-technology/school-of-innovation-sciences/education-administration-ieis/request-exemption-form/',
//     'https://studyguide.tue.nl/programs/bachelor-college/majors/psychology-technology/school-of-innovation-sciences/program-committee-is/',
//     'https://studyguide.tue.nl/programs/bachelor-college/majors/psychology-technology/school-of-innovation-sciences/exam-committee-is/',
//     'https://studyguide.tue.nl/programs/bachelor-college/majors/psychology-technology/school-of-innovation-sciences/exam-committee-is/diplom-award-sessions/',
//     'https://studyguide.tue.nl/programs/bachelor-college/majors/psychology-technology/school-of-innovation-sciences/exam-committee-is/dates-exam-committee-meetings/',
//     'https://studyguide.tue.nl/programs/bachelor-college/majors/psychology-technology/school-of-innovation-sciences/exam-committee-is/predicates/',
//     'https://studyguide.tue.nl/programs/bachelor-college/majors/psychology-technology/school-of-innovation-sciences/exam-committee-is/academic-fraud/',
//     'https://studyguide.tue.nl/programs/bachelor-college/majors/psychology-technology/school-of-innovation-sciences/student-assistants-ieis/',
//     'https://studyguide.tue.nl/programs/bachelor-college/majors/psychology-technology/school-of-innovation-sciences/student-assistants-ieis/',
//     'https://studyguide.tue.nl/programs/bachelor-college/majors/psychology-technology/school-of-innovation-sciences/quality-assurance/',
//     'https://studyguide.tue.nl/programs/bachelor-college/majors/psychology-technology/education-information-pt/',
//     'https://studyguide.tue.nl/programs/bachelor-college/majors/psychology-technology/curriculum/',
//     'https://studyguide.tue.nl/programs/bachelor-college/majors/psychology-technology/curriculum/basic-courses/',
//     'https://studyguide.tue.nl/programs/bachelor-college/majors/psychology-technology/curriculum/elective-courses-and-packages/',
//     'https://studyguide.tue.nl/programs/bachelor-college/majors/psychology-technology/curriculum/elective-courses-and-packages/deepening-packages/',
//     'https://studyguide.tue.nl/programs/bachelor-college/majors/psychology-technology/curriculum/elective-courses-and-packages/elective-courses-and-packages/',
//     'https://studyguide.tue.nl/programs/bachelor-college/majors/psychology-technology/coaching/',
//     'https://studyguide.tue.nl/programs/bachelor-college/majors/psychology-technology/coaching/2016-2017/',
//     'https://studyguide.tue.nl/programs/bachelor-college/majors/psychology-technology/coaching/2015-2016/',
//     'https://studyguide.tue.nl/programs/bachelor-college/majors/psychology-technology/coaching/2014-2015/',
//     'https://studyguide.tue.nl/programs/bachelor-college/majors/psychology-technology/coaching/2013-2014/',
//     'https://studyguide.tue.nl/programs/bachelor-college/majors/psychology-technology/professional-skills/',
//     'https://studyguide.tue.nl/programs/bachelor-college/majors/psychology-technology/final-project-bachelor-psychology-technology/',
//     'https://studyguide.tue.nl/programs/bachelor-college/majors/psychology-technology/examination-schedules/',
//     'https://studyguide.tue.nl/programs/bachelor-college/majors/psychology-technology/graduation-and-examination-dates/',
//     'https://studyguide.tue.nl/programs/bachelor-college/majors/psychology-technology/subsequent-masters/',
//     'https://studyguide.tue.nl/programs/bachelor-college/majors/psychology-technology/regulations/',
//     'https://studyguide.tue.nl/programs/bachelor-college/majors/psychology-technology/advisors-tutors/',
//     'https://studyguide.tue.nl/programs/bachelor-college/majors/psychology-technology/contact/'
// ];

// HTI URLs
// const urls = [
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/timeline-master/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/timeline-master/course-registration/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/admission-to-msc-hti/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/admission-to-msc-hti/admission-tue-bachelors/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/admission-to-msc-hti/admission-non-tue-bachelors/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/school-of-innovation-sciences/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/school-of-innovation-sciences/education-administration-ieis/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/school-of-innovation-sciences/education-administration-ieis/registration-for-courses/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/school-of-innovation-sciences/education-administration-ieis/request-exemption-form/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/school-of-innovation-sciences/program-committee-is/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/school-of-innovation-sciences/exam-committee-is/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/school-of-innovation-sciences/exam-committee-is/diplom-award-sessions/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/school-of-innovation-sciences/exam-committee-is/dates-exam-committee-meetings/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/school-of-innovation-sciences/exam-committee-is/predicates/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/school-of-innovation-sciences/exam-committee-is/academic-fraud/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/school-of-innovation-sciences/student-assistants-ieis/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/school-of-innovation-sciences/internship-agreements-ieis/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/school-of-innovation-sciences/quality-assurance/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/school-of-innovation-sciences/quality-assurance/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/curriculum/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/curriculum/core-courses/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/curriculum/specialization-electives/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/curriculum/engineering-courses/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/curriculum/scheduling-2016-2017/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/coaching-and-professional-skills/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/coaching-and-professional-skills/hti-mentor-system/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/coaching-and-professional-skills/hti-study-advisor/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/coaching-and-professional-skills/professional-skills/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/coaching-and-professional-skills/alumni-coach-network/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/exchange-program-international-semester/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/exchange-program-international-semester/exchange-program-incoming-students/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/exchange-program-international-semester/international-course-outgoing-students/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/exchange-program-international-semester/international-course-outgoing-students/courses-abroad/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/exchange-program-international-semester/international-course-outgoing-students/documents-and-forms/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/exchange-program-international-semester/international-course-outgoing-students/scholarships/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/graduation/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/graduation/master-thesis/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/graduation/graduation-regulations/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/graduation-and-examination-dates/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/examination-schedules/',
//     'https://studyguide.tue.nl/programs/graduate-school/masters-programs/human-technology-interaction/regulations/'
// ];

urls.forEach(url => {
    let sc = scraper.StaticScraper.create(url);
    let page = {};

    page['source'] = '';
    page['content'] = '';
    page['headings'] = [];
    page['title'] = '';
    page['faculty'] = 'Psychology & Technology';
    page['degree'] = 'Master MSc';
    page['program'] = 'Human-Technology Interaction';
    page['url'] = url;

    sc.scrape(function ($) {
        return $('main').map(function () {
            return $(this).html();
        }).get();
    }).then(function (main) {
        // Only take the first main element
        main = '<main>' + main[0] + '</main>';

        // Remove useless newlines and tabs
        main = main.replace(/\t/g, '');
        main = main.replace(/(\n)+/g, '\n');

        // Save main HTML
        page['source'] = main;

        // Load page source
        let $ = cheerio.load(main);

        // Get content
        page['content'] = $.text().trim().replace(/(\n)+/g, '\n');

        // Get headings
        let headings = $('h3');
        headings.toArray().forEach(header => {
            try {
                page['headings'].push(header.children[0].data.trim());
            } catch (ex) {
                console.log('\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\nheader is wrong on page ' + url + '\n');
            }
        });
        headings = $('strong');
        headings.toArray().forEach(header => {
            try {
                page['headings'].push(header.children[0].data.trim());
            } catch (ex) {
                console.log('\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\nheader is wrong on page ' + url + '\n');
            }
        });

        // Get page title
        try {
            page['title'] = $('h1')['0'].children[0].data.trim(); // this may not work for all pages
        } catch (ex) {
            console.log('\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\ntitle is wrong on page ' + url + '\n');
        }

        // Add page to search database
        console.log(page);
        db.query(db => {
            // db.collection('search2').insertOne(page);
        });
    });
});
