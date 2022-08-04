const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();

const port = 8080;

app.use(express.static(path.join(__dirname, '../build')));
app.use(morgan('combined'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
