const express = require("express");

const recordRouter = express.Router();

const logger = require("../utils/logger.js");
const postgres = require("../models/postgres.js")
const fflate = require('fflate');

const allRecordedEvents = [];
let sessionIndex;

recordRouter.get("/", (req, res) => { // method to be deleted when we migrate from sandbox frontend to true frontend
  postgres.db.one("SELECT encode(session_data::bytea, 'escape') as session_data FROM sessions WHERE id = $1", [3], session => session.session_data)
    .then(data => JSON.parse(data))
    .then(data => Object.keys(data).map((key) => data[key]))
    .then(data => new Uint8Array(data))
    .then(data => JSON.parse(fflate.strFromU8(fflate.decompressSync(data))))
    .then(data => res.json(data))
    .catch((error) => {
      console.log('Unable to retrieve event data from PostgreSQL:', error.message);
      res.json(error)
    });
});

recordRouter.post("/", (req, res) => {
  const batchOfEvents = req.body;
  
  allRecordedEvents.push(batchOfEvents);

  const compressedEventsString = fflate.strToU8(JSON.stringify(allRecordedEvents));
  const allEventsCompressed = fflate.compressSync(compressedEventsString, { level: 6})
  
  if (sessionIndex) {
    postgres.db.any('UPDATE sessions SET session_data = $1 WHERE id = $2', [allEventsCompressed, sessionIndex])
    .then(data => {
        res.sendStatus(200);
        console.log(`Successfully updated session ${sessionIndex} events in PostgreSQL.`)
    })
    .catch((error) => {
      console.log(`Unable to update session ${sessionIndex} events in PostgreSQL:`, error.message);
    });
  } else {
    postgres.db.one('INSERT INTO sessions(session_data) VALUES($1) RETURNING id', [allEventsCompressed], session => session.id)
    .then(data => {
        sessionIndex = data;
        res.sendStatus(200);
        console.log(`Successfully added new session to database. Current ID is ${sessionIndex}`)
    })
    .catch((error) => {
      console.log('Unable to add new session to PostgreSQL:', error.message);
    });
  }
});



module.exports = recordRouter;
