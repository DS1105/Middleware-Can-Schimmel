require('dotenv').config({ path: '/Users/seracan/MT/Middleware-Can-Schimmel/.env' });
const mongoose = require('mongoose');
const { Logtail } = require('@logtail/node');

const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN);
const dbUri = process.env.MONGO_URI || 'mongodb://localhost:27017/myDatabase';

// Datenbankverbindung mit Logging
mongoose
  .connect(dbUri)
  .then(() => {
    logtail.info("Datenbank erfolgreich verbunden", { dbUri });
  })
  .catch((err) => {
    logtail.error("Fehler beim Verbinden mit der Datenbank", { error: err.message });
  });