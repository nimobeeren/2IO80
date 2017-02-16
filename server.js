const express = require('express');
const app = express();
const server = require('http').createServer(app);
const db = require('./db/db.js');
const routes = require('./routes/routes.js').use(app, express, db);
const scraper = require('scraperjs');
const cheerio = require('cheerio');

const port = process.env.PORT || 80;

server.listen(port);

console.log("Server running port:", port);

const urls = [
    'https://studyguide.tue.nl/programs/bachelor-college/majors/web-science/',
    'https://studyguide.tue.nl/programs/bachelor-college/majors/web-science/program-learning-objectives/',
    'https://studyguide.tue.nl/programs/bachelor-college/majors/web-science/curriculum/',
    'https://studyguide.tue.nl/programs/bachelor-college/majors/web-science/curriculum/basic-courses/',
    'https://studyguide.tue.nl/programs/bachelor-college/majors/web-science/curriculum/elective-courses-and-packages/',
    'https://studyguide.tue.nl/programs/bachelor-college/majors/web-science/coaching/'
];

urls.forEach(url => scrape(url));

function scrape(url) {
    let sc = scraper.StaticScraper.create(url);
    let page = {};

    sc.scrape(function ($) {
        return $("main").get();
    }).then(function (content) {
        console.log(sc.body, sc.getBody());
            // content = content.reduce((result, line) => {
            //     console.log(line);
            //     return result += line;
            // }, "");
            // content = content.replace(/\t|\n/g, " ");
            // page['contents'] = content;
            // console.log(content);
        });
    //
    // sc.scrape(function ($) {
    //     return $("main h3").map(function () {
    //         return $(this).text();
    //     }).get();
    // })
    //     .then(function (headers) {
    //         page['headers'] = headers;
    //         console.log(headers);
    //     });
    //
    // sc.scrape(function ($) {
    //     return $("main #pagetitle h1").map(function () {
    //         return $(this).text();
    //     }).get();
    // })
    //     .then(function (title) {
    //         page['title'] = title[0];
    //         console.log(title[0]);
    //     });

    // page['faculty'] = 'Mathematics & Computer Science';
    // page['url'] = url;
    // page['degree'] = 'Bachelor BSc';
    // page['program'] = 'Web Science';

    // db.query(db => {
    //     db.collection("search").insertOne(page);
    // })
}
