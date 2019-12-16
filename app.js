const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;

const URL = JSON.parse(fs.readFileSync(`${__dirname}/db/URLDB.json`));

const registerURL = (req, res) => {
  console.log(' hi there, this is for registerURL');
  res.status(201).json({
    status: 'success',
    data: {
      nono: 'nono'
    }
  });
};
const getTest = (req, res) => {
  console.log('get test');
  res.status(200).json({
    status: 'success',
    data: {
      nono: 'nono'
    }
  });
};
app.use(express.json());
app.route('/').get(getTest);
app.route('register').post(registerURL);

app.listen(port, () => {
  console.log(`server is running on port ${port}!`);
});
