const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/todo';
const pool = require('../lib/pgdb');

/************************************
  GET home page
*************************************/
router.get('/', function(req, res, next) {
  res.render('index', { title: 'George' });
});


/************************************
  CREATE API 
*************************************/
router.post('/', (req, res, next) => {

  // Grab data from http request
  const data = {text: req.body.text, complete: false};

  // Insert a new item into the list
  pool.query('INSERT INTO items(text, complete) values($1, $2)',
    [data.text, data.complete]), function(err, res) {
    
      if(err) {
        done();
        console.log(err);
        return res.status(500).json({success: false, data: err});
      }
      console.log("Insert successful")
  };

  // SQL Query > Select Data
  pool.query('SELECT * FROM items ORDER BY id ASC', ""), function(err, res) {
    return res.json(res.rows);
  };
});

module.exports = router;
