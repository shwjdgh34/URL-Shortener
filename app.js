const moment = require('moment');
const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;
// constructed promise for readFile() and writeFile()
const readFilePro = file => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject('Could not find that file 😥');
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, err => {
      if (err) reject('Could not write that file 😥');
      resolve('success to write');
    });
  });
};
//reference : https://gist.github.com/gordonbrander/2230317
const makeID = () => {
  return Math.random()
    .toString(36)
    .substr(2, 9);
};
const registerURL = async (req, res) => {
  const protocol = req.protocol;
  const host = req.get('host');
  const reqURL = req.query.url;
  const baseURL = `${protocol}://${host}`;
  //const URLDB = JSON.parse(fs.readFileSync(`${__dirname}/db/URLDB.json`));
  //try- catch
  try {
    const data = await readFilePro(`${__dirname}/db/URLDB.json`);
    const URLDB = JSON.parse(data);
    // search DB wether the url exists already.
    const dbURLObj = URLDB.find(el => el.url === reqURL);
    // if not exist - create
    if (!dbURLObj) {
      console.log(URLDB.length);
      // TODO: make constraint fuction
      if (URLDB.length >= 10000) {
        return res.status(409).json({
          status: 'fail to save url due to full db'
        });
      }
      const newId = makeID();
      const newURLObj = Object.assign({ id: newId, url: reqURL });
      URLDB.push(newURLObj);
      await writeFilePro(`${__dirname}/db/URLDB.json`, JSON.stringify(URLDB));
      res.status(201).json({
        url: `${baseURL}/${newURLObj.id}`
      });
    }
    // if exist - return
    else {
      res.status(200).json({
        url: `${baseURL}/${dbURLObj.id}`
      });
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};
const redirectToURL = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await readFilePro(`${__dirname}/db/URLDB.json`);
    const URLDB = JSON.parse(data);
    const dbURLObj = URLDB.find(val => val.id === id);

    if (dbURLObj) {
      //create stats.
      const visitData = await readFilePro(`${__dirname}/db/VisitDB.json`);
      const visitDB = JSON.parse(visitData);
      const visitTime = moment().format('YYYY-MM-DD hh:mm:ss');
      if (visitDB[id]) visitDB[id].push(visitTime);
      else visitDB[id] = [visitTime];

      await writeFilePro(
        `${__dirname}/db/VisitDB.json`,
        JSON.stringify(visitDB)
      );
      res.redirect(301, dbURLObj.url);
    } else {
      // TODO: proper Status code
      res.status(404);
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getStats = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await readFilePro(`${__dirname}/db/VisitDB.json`);
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
      // TODO: proper Status code
      res.status(404);
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};
app.use(express.json());
// TODO: error handle
app.route('/register.json').post(registerURL);
app.route('/:id').get(redirectToURL);
app.route('/:id/stats').get(getStats);

app.listen(port, () => {
  console.log(`server is running on port ${port}!`);
});
