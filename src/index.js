const express = require('express')
const route = require('../src/routes/route')
const bodyparser = require('body-parser')

const app = express()


const { Client } = require('pg')
const client = new Client({
  user: 'yourname',
  host: 'localhost',
  database: 'psqltraining',
  password:'yourpassword',
  port: 5432,
})
client.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Routes
app.use('/', route);

app.use('/*', function (req, res) {
  return res.status(400).send({ status: false, msg: 'You Are In Wrong Path' })
})


app.listen(3000 || process.env.port, ()=> console.log('project running on port ' + (process.env.PORT||3000)))