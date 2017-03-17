const express = require('express');
const app = express();
const server = require('http').createServer(app);
const db = require('./db/db.js');
const routes = require('./routes/routes.js').use(app, express, db);
const mustache  = require('mustache-express');
const port = process.env.PORT || 80;

server.listen(port);

app.engine('html', mustache());
app.set('view engine', 'mustache');

console.log("Server running port:", port);