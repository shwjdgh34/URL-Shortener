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
  const baseURL = `${protocol}://${host}`;
  //const URLDB = JSON.parse(fs.readFileSync(`${__dirname}/db/URLDB.json`));
  fs.readFile(`${__dirname}/db/URLDB.json`, (err, data) => {
    if (err) throw err;
    const URLDB = JSON.parse(data);
    // search DB wether the url exists already.
    const dbURLObj = URLDB.find(el => el.url === reqURL);

    // if not exist - create
    if (!dbURLObj) {
      console.log(URLDB.length);
      if (URLDB.length >= 10000) {
        return res.status(409).json({
          status: 'fail to save url due to full db'
        });
      }
      const newId = makeID();
      const newURLObj = Object.assign({ id: newId, url: reqURL });
      URLDB.push(newURLObj);
      fs.writeFile(`${__dirname}/db/URLDB.json`, JSON.stringify(URLDB), err => {
        res.status(201).json({
          url: `${baseURL}/${newURLObj.id}`
        });
      });
    }
    // if exist - return
    else {
      res.status(200).json({
        url: `${baseURL}/${dbURLObj.id}`
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
      //create stats.
      fs.writeFile(`${__dirname}/db/VisitDB.json`, err => {
        if (err) throw err;
        res.redirect(301, dbURLObj.url);
      });
    } else {
      res.status(404);
    }
  });
};

const getStats = (req, res) => {
  const id = req.params.id;
  fs.readFile(`${__dirname}/db/VisitDB.json`, (err, data) => {
    if (err) throw err;
    const result = JSON.parse(data)[id];
    const hash = Object.create(null);
    const grouped = [];

    if (result) {
      result.forEach(ele => {
        const key = ele.slice(0, 13);

        if (!hash[key]) {
          hash[key] = { at: key + ':00:00', visit: 0 };
          grouped.push(hash[key]);
        }
        hash[key].visit += 1;
      });
      grouped.sort(function(a, b) {
        return a.at.localeCompare(b.at);
      });

      res.status(200).json({
        Stats: grouped
      });
    } else {
      res.status(404);
    }
  });
};
app.use(express.json());
app.route('/register.json').get(registerURL);
app.route('/:id').get(redirectToURL);
app.route('/:id/stats').get(getStats);

app.listen(port, () => {
  console.log(`server is running on port ${port}!`);
});
