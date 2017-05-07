const pool = require('../lib/pgdb');

//to run a query we just pass it to the pool
//after we're done nothing has to be taken care of
//we don't have to return any client to the pool or close a connection
pool.query('CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)', "", function(err, res) {
  if(err.code = '42P07') {
    return console.error('Items table already exists');
  }

  console.log("Done: ", res.rows[0]);
});
