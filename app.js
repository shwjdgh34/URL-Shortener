const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;

const makeID = () => {
  return Math.random()
    .toString(36)
    .substr(2, 9);
};
const registerURL = (req, res) => {
  const reqURL = req.query.url;
  //const URLDB = JSON.parse(fs.readFileSync(`${__dirname}/db/URLDB.json`));
  fs.readFile(`${__dirname}/db/URLDB.json`, (err, data) => {
    const URLDB = JSON.parse(data);
    // search DB wether the url exists already.
    const dbURL = URLDB.find(el => el.url === reqURL);

    // if not exist - create
    if (!dbURL) {
      const newId = makeID();
      const newURL = Object.assign({ id: newId, url: reqURL });
      URLDB.push(newURL);
      fs.writeFile(`${__dirname}/db/URLDB.json`, JSON.stringify(URLDB), err => {
        res.status(201).json({
          url: `http://localhost:3000/${newURL.id}`
        });
      });
    }
    // if exist - return
    else {
      res.status(200).json({
        url: `http://localhost:3000/${dbURL.id}`
      });
    }
  });
};
const redirectToURL = (req, res) => {
  const id = req.params.id;
  fs.readFile(`${__dirname}/db/URLDB.json`, (err, data) => {
    if (err) throw err;
    const db = JSON.parse(data);
    const result = db.find(val => val.id === id);

    if (result) {
      res.redirect(301, result.url);
    } else {
      res.status(404);
    }
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
