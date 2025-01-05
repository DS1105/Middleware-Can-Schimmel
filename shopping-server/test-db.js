const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/myDatabase')
  .then(() => console.log('Datenbank verbunden'))
  .catch(err => console.error('Fehler beim Verbinden:', err));