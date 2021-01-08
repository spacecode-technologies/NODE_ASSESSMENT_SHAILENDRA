const express = require("express");
const bodyParser = require('body-parser');
const cookieParser  = require('cookie-parser');
const cors = require("cors");

const app = express();

/* Database connection */
require("./mongo");

/* require all models */
require('./model/users');
require('./model/address');
require('./model/company');

let authRoute = require('./routes/supportapi');

const port = process.env.PORT || 3000;

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/v1", authRoute);

const server = app.listen(port, function (err) {
  if(!err) {
    console.log('✓ server running on port:'+ port);
    console.log('x Press CTRL-C to stop\n');
  }
});

module.exports = app;
