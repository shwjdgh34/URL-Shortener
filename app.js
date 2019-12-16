const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;

const URL = JSON.parse(fs.readFileSync(`${__dirname}/db/URLDB.json`));
const makeID = () => {
  return Math.random()
    .toString(36)
    .substr(2, 9);
};
const registerURL = (req, res) => {
  console.log(req.query.url);

  console.log(' hi there, this is for registerURL');

  // search DB wether the url exists already.

  // if exist - return
  res.status(200).json({
    url: `http://localhost:3000/${id}`
  });
  // if not - create
  //   res.status(201).json({
  //     url: 'http://localhost:3000/abuwksd54 '
  //   });
};
const redirectToURL = (req, res) => {
  console.log('redirectToURL');
  res.status(200).json({
    redirectTo: 'the Location'
  });
};

const getStats = (req, res) => {
  console.log('getStats');
  res.status(200).json({
    Stats: [
      { at: '2018-03-02 01:00:00', visits: '100' },
      { at: '2018-03-02 02:00:00', visits: '200' },
      { at: '2018-03-02 03:00:00', visits: '300' }
    ]
  });
};
app.use(express.json());
app.route('/register.json').get(registerURL);
app.route('/:id').get(redirectToURL);
app.route('/:id/stats').get(getStats);

app.listen(port, () => {
  console.log(`server is running on port ${port}!`);
});
