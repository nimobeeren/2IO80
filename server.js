const express = require('express');
const app = express();
const server = require('http').createServer(app);
const db = require('./db/db.js');
const routes = require('./routes/routes.js').use(app, express, db);

// db.query(db => {
//    db.collection().find().next().then(obj => {
//        console.log(obj);
//    })
// });


const port = process.env.PORT || 80;

server.listen(port);

console.log("Server running port:", port);