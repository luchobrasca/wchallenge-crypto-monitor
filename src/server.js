const express = require('express')
const app = express();
const cors    = require('cors')
const bodyParser = require('body-parser');
const db = require('./_helpers/db');
const errorHandler = require('./_middleware/error-handler');
const jwt = require('./_middleware/jwt');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
app.use(jwt());

//// api routes
app.use('/users', require('./controllers/User.Controller'));
app.use('/cryptos', require('./controllers/CryptoCurrency.Controller'));

// global error handler
app.use(errorHandler);

const port = 8080

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

module.exports = app;