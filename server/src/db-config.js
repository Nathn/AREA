const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

mongoose.set('strictQuery', true); // Ensure that queries comply with the schemas defined in /models
mongoose.connect(uri);

const db = mongoose.connection;

db.on('error', () => console.error('An error occured while connecting to the database:'));
db.once('open', () => console.log('Successfully connected to MongoDB'));

module.exports = db;
