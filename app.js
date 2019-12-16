const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;

//reference : https://gist.github.com/gordonbrander/2230317
const makeID = () => {
  return Math.random()
    .toString(36)
    .substr(2, 9);
};
const registerURL = (req, res) => {
  const protocol = req.protocol;
  const host = req.get('host');
  const reqURL = req.query.url;
  //const URLDB = JSON.parse(fs.readFileSync(`${__dirname}/db/URLDB.json`));
  fs.readFile(`${__dirname}/db/URLDB.json`, (err, data) => {
    if (err) throw err;
    const URLDB = JSON.parse(data);
    // search DB wether the url exists already.
    const dbURLObj = URLDB.find(el => el.url === reqURL);

    // if not exist - create
    if (!dbURLObj) {
      const newId = makeID();
      const newURLObj = Object.assign({ id: newId, url: reqURL });
      URLDB.push(newURLObj);
      fs.writeFile(`${__dirname}/db/URLDB.json`, JSON.stringify(URLDB), err => {
        res.status(201).json({
          url: `${protocol}://${host}/${newURLObj.id}`
        });
      });
    }
    // if exist - return
    else {
      res.status(200).json({
        url: `${protocol}://${host}/${dbURLObj.id}`
      });
    }
  });
};
const redirectToURL = (req, res) => {
  const id = req.params.id;
  fs.readFile(`${__dirname}/db/URLDB.json`, (err, data) => {
    if (err) throw err;
    const URLDB = JSON.parse(data);
    const dbURLObj = URLDB.find(val => val.id === id);

    if (dbURLObj) {
      res.redirect(301, dbURLObj.url);
      //res.status(200).json(dbURLObj.url);
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
