const mongoose = require('mongoose');
const uri = "mongodb+srv://corentinlevet:58e1KHanQWUOFM18@area.jtrmzx9.mongodb.net/area-db?retryWrites=true&w=majority"; // TODO : Load from env

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

module.exports = db;
