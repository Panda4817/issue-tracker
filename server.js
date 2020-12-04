'use strict';
require('dotenv').config();
const express     = require('express');
const myDB = require('./connection');
const bodyParser  = require('body-parser');
const expect      = require('chai').expect;
const cors        = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

const apiRoutes         = require('./routes/api.js');
const fccTestingRoutes  = require('./routes/fcctesting.js');
const runner            = require('./test-runner');

const app = express();
app.set('view engine', 'pug')
app.use('/public', express.static(process.cwd() + '/public'));
app.use(cors({origin: '*'})); //For FCC testing purposes only
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//For FCC testing purposes
fccTestingRoutes(app);

myDB(async client => {
  const db = await client.db('tracker').collection('issue');
  apiRoutes(app, db);

  //404 Not Found Middleware
  app.use(function(req, res, next) {
    res.status(404)
      .type('text')
      .send('Not Found');
  });


}).catch(e => {
  console.log(e)
  //app.route('/').get((req, res) => {
    //res.render('index.pug');
  //});
});


//Start our server and tests!
app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + process.env.PORT);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        var error = e;
          console.log('Tests are not valid:');
          console.log(error);
      }
    }, 3500);
  }
});

module.exports = app; //for testing
