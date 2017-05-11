const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');
const pool = require('../lib/pgdb');

/************************************
  GET home page
*************************************/

router.get('/', (req, res, next) => {
  res.sendFile('/public/index.html');
});

router.get('/rootv1', function(req, response, next) {

  var resultData = ['NOT SET'];

  pool.query('SELECT * FROM items WHERE id=(SELECT max(id) FROM items)', "", function(err, result) {
    if (err) {
      resultData = ['ERROR'];
    }
    else {
      resultData = result.rows;
    }
    response.render('index', { title: 'George', results: JSON.stringify(resultData,null,4) });
  });
});


/************************************
  CREATE API 
*************************************/
router.post('/api/v1/todo', (req, response, next) => {

  // Grab data from http request
  const data = {text: req.body.text, complete: false};

  // Insert a new item into the list
  pool.query('INSERT INTO items(text, complete) values($1, $2)',
    [data.text, data.complete], function(err, result) {
    
      if(err) {
        //done();
        console.log(err);
        return response.status(500).json({success: false, data: err});
      }
      console.log("Insert successful")

      pool.query('SELECT * FROM items ORDER BY id ASC', "", 
        function(err, result) {
          if (err) {
            console.log(err.code)
          }
        
          response.send(JSON.stringify(result.rows,null,4));
     });
   });
   //response.sendStatus(200);
});

/************************************
  READ API  
*************************************/
router.get('/api/v1/todo', (req, response, next) => {

  // Read last id of the list
  pool.query('SELECT * FROM items WHERE id=(SELECT max(id) FROM items)', "", 
    function(err, result) {
      response.send(JSON.stringify(result.rows,null,4));
  });
});

/************************************
  READ API - specific id
*************************************/
router.get('/api/v1/todo/id/:todo_id', (req, response, next) => {

  // Get target id to be updated
  const id = req.params.todo_id;

  // Read specific id from the list
  pool.query('SELECT * FROM items WHERE id=($1)', [ id ], function(err, result) {
      response.send(JSON.stringify(result.rows,null,4));
  });
});

/************************************
  READ API - all items
*************************************/
router.get('/api/v1/todo/all', (req, response, next) => {

  // Read specific id from the list
  pool.query('SELECT * FROM items ORDER BY id ASC', "", 
    function(err, result) {
      if (err) {
        console.log(err.code)
      }
      response.send(JSON.stringify(result.rows,null,4));
  });
});

/************************************
  UPDATE API  
*************************************/
router.put('/api/v1/todo/:todo_id', (req, response, next) => {

  // Grab data from http request
  const data = {text: req.body.text, complete: req.body.complete};

  // Get target id to be updated
  const id = req.params.todo_id;

  // Insert a new item into the list
  pool.query('UPDATE items SET text=($1), complete=($2) WHERE id=($3)',
    [data.text, data.complete, id], function(err, result) {
      
      if(err) {
        done();
        console.log(err);
        return response.status(500).json({success: false, data: err});
      }
      else {
        console.log("Update successful");
      }
      
      pool.query('SELECT * FROM items ORDER BY id ASC', "", 
        function(err, result) {
          if (err) {
            console.log(err.code)
          }
        
          response.write(JSON.stringify(result.rows,null,4));
          response.sendStatus(202);
     });
  });
});

/************************************
  DELETE API  
*************************************/
router.delete('/api/v1/todo/:todo_id', (req, response, next) => {

  // Grab data from http request
  const data = {text: req.body.text, complete: req.body.complete};

  // Get target id to be updated
  const id = req.params.todo_id;

  // Insert a new item into the list
  pool.query('DELETE FROM items WHERE id=($1)', [ id ],
    function(err, result) {
      
      if(err) {
        done();
        console.log(err);
        return response.status(500).json({success: false, data: err});
      }
      else {
        console.log("Delete successful");
      }

      pool.query('SELECT * FROM items ORDER BY id ASC', "", 
        function(err, result) {
          if (err) {
            console.log(err.code)
          }
        
          response.send(JSON.stringify(result.rows,null,4));
     });
  });
});

module.exports = router;
