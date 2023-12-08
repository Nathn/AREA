const cors = require('cors');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes');

const corsOptions = {
  origin: true, // Allow the server to accept cross-origin requests
  credentials: true // Allow the server to accept requests without credentials
};

app.use(express.json({ limit: '10mb' })); // Limit the size of JSON requests to 10mb
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Limit the size of URL-encoded requests to 10mb

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', routes);

module.exports = app;
