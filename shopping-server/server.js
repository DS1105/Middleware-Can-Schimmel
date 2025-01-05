// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.json());

// Dummy-Datenbank - Ersetze dies mit einer echten Datenbank
let shoppingItems = [
  { name: 'Apples', amount: 5 },
  { name: 'Bananas', amount: 3 },
];

// Alle Artikel abrufen
app.get('/api/shoppingItems', (req, res) => {
  res.json(shoppingItems);
});

// Einzelnen Artikel abrufen
app.get('/api/shoppingItems/:name', (req, res) => {
  const item = shoppingItems.find((i) => i.name === req.params.name);
  if (item) {
    res.json(item);
  } else {
    res.status(404).send('Artikel nicht gefunden');
  }
});

// Artikel hinzufügen
app.post('/api/shoppingItems', (req, res) => {
  const { name, amount } = req.body;
  if (!name || amount == null) {
    return res.status(400).send('Ungültige Anfrage');
  }

  const existingItem = shoppingItems.find((i) => i.name === name);
  if (existingItem) {
    return res.status(400).send('Artikel existiert bereits');
  }

  shoppingItems.push({ name, amount });
  res.status(201).json({ name, amount });
});

// Artikel aktualisieren
app.put('/api/shoppingItems/:name', (req, res) => {
  const { name, amount } = req.body;
  const itemIndex = shoppingItems.findIndex((i) => i.name === req.params.name);

  if (itemIndex === -1) {
    return res.status(404).send('Artikel nicht gefunden');
  }

  shoppingItems[itemIndex] = { name, amount };
  res.json(shoppingItems[itemIndex]);
});

// Artikel löschen
app.delete('/api/shoppingItems/:name', (req, res) => {
  shoppingItems = shoppingItems.filter((i) => i.name !== req.params.name);
  res.send('Artikel gelöscht');
});

// Graceful Shutdown
process.on('SIGINT', () => {
  console.log('Server wird heruntergefahren...');
  process.exit();
});

// Server starten
app.listen(port, () => {
  console.log(`Server läuft unter http://localhost:${port}`);
});