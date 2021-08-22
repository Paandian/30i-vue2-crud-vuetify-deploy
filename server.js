const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// npm install --save connect-history-api-fallback
// added this line to avoid 404 error on refresh
var history = require('connect-history-api-fallback');

const path = __dirname + '/app/views/';

const app = express();

// added this line to avoid 404 error on refresh
app.use(history());

app.use(express.static(path));

var corsOptions = {
  origin: 'http://localhost:8081',
};

// Original line
// app.use(cors(corsOptions));

//updated with below line to overcome the CORS allow origin error
app.use(cors({ origin: corsOptions, credentials: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require('./app/models');
const Role = db.role;

// after the first sync use the below code
// db.sequelize.sync();

// initial() function helps us to create 3 rows in database.
// In development, you may need to drop existing tables and re-sync database. So you can use force: true as code below.
// For production, just insert these rows manually and use sync() without parameters to avoid dropping data

// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and Resync Db");
//   initial();
// });

// simple route
app.get('/', (req, res) => {
  res.sendFile(path + 'index.html');
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/tutorial.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.create({
    id: 1,
    name: 'user',
  });

  Role.create({
    id: 2,
    name: 'moderator',
  });

  Role.create({
    id: 3,
    name: 'admin',
  });
}
