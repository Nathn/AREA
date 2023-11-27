const port = 8080;
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
