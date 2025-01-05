require('dotenv').config({ path: '/Users/seracan/MT/Middleware-Can-Schimmel/.env' });
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const { Logtail } = require('@logtail/node');

// Logger initialisieren
const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN);

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

// MongoDB-Verbindung
const url = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = 'shoppingDB';
const client = new MongoClient(url);

let shoppingCollection;

async function startServer() {
  try {
    await client.connect();
    logtail.info('Mit MongoDB verbunden');
    const db = client.db(dbName);
    shoppingCollection = db.collection('shoppingItems');

    app.listen(port, () => {
      logtail.info(`Server läuft unter http://localhost:${port}`);
    });
  } catch (error) {
    logtail.error('Fehler beim Verbinden mit MongoDB', { error: error.message });
    process.exit(1); // Beende den Prozess bei Verbindungsfehlern
  }
}

// **1. Alle Artikel abrufen**
app.get('/api/shoppingItems', async (req, res) => {
  try {
    logtail.info('GET /api/shoppingItems aufgerufen');
    const items = await shoppingCollection.find({}).toArray();
    res.json(items);
  } catch (error) {
    logtail.error('Fehler beim Abrufen der Artikel', { error: error.message });
    res.status(500).send('Fehler beim Abrufen der Artikel');
  }
});

// **2. Einzelnen Artikel abrufen**
app.get('/api/shoppingItems/:id', async (req, res) => {
  try {
    logtail.info(`GET /api/shoppingItems/${req.params.id} aufgerufen`);
    if (!ObjectId.isValid(req.params.id)) {
      logtail.warn('Ungültige ID übergeben', { id: req.params.id });
      return res.status(400).send('Ungültige ID');
    }
    const item = await shoppingCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (item) {
      res.json(item);
    } else {
      res.status(404).send('Artikel nicht gefunden');
    }
  } catch (error) {
    logtail.error('Fehler beim Abrufen des Artikels', { error: error.message });
    res.status(500).send('Fehler beim Abrufen des Artikels');
  }
});

// **3. Artikel hinzufügen**
app.post('/api/shoppingItems', async (req, res) => {
  try {
    logtail.info('POST /api/shoppingItems aufgerufen', { body: req.body });
    const { name, amount } = req.body;
    if (!name || amount == null) {
      logtail.warn('Ungültige Anfrage: Name und Anzahl erforderlich', { body: req.body });
      return res.status(400).send('Ungültige Anfrage: Name und Anzahl erforderlich');
    }

    const result = await shoppingCollection.insertOne({ name, amount });
    res.status(201).json({ _id: result.insertedId, name, amount });
  } catch (error) {
    logtail.error('Fehler beim Hinzufügen des Artikels', { error: error.message });
    res.status(500).send('Fehler beim Hinzufügen des Artikels');
  }
});

// **4. Artikel aktualisieren**
app.put('/api/shoppingItems/:id', async (req, res) => {
  try {
    logtail.info(`PUT /api/shoppingItems/${req.params.id} aufgerufen`, { body: req.body });
    if (!ObjectId.isValid(req.params.id)) {
      logtail.warn('Ungültige ID übergeben', { id: req.params.id });
      return res.status(400).send('Ungültige ID');
    }

    const { name, amount } = req.body;
    if (!name || amount == null) {
      logtail.warn('Ungültige Anfrage: Name und Anzahl erforderlich', { body: req.body });
      return res.status(400).send('Ungültige Anfrage: Name und Anzahl erforderlich');
    }

    const result = await shoppingCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { name, amount } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send('Artikel nicht gefunden');
    }

    res.json({ message: 'Artikel aktualisiert' });
  } catch (error) {
    logtail.error('Fehler beim Aktualisieren des Artikels', { error: error.message });
    res.status(500).send('Fehler beim Aktualisieren des Artikels');
  }
});

// **5. Artikel löschen**
app.delete('/api/shoppingItems/:id', async (req, res) => {
  try {
    logtail.info(`DELETE /api/shoppingItems/${req.params.id} aufgerufen`);
    if (!ObjectId.isValid(req.params.id)) {
      logtail.warn('Ungültige ID übergeben', { id: req.params.id });
      return res.status(400).send('Ungültige ID');
    }

    const result = await shoppingCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).send('Artikel nicht gefunden');
    }

    res.send('Artikel gelöscht');
  } catch (error) {
    logtail.error('Fehler beim Löschen des Artikels', { error: error.message });
    res.status(500).send('Fehler beim Löschen des Artikels');
  }
});


// Graceful Shutdown - SIGINT und SIGTERM behandeln
process.on('SIGTERM', async () => {
  logtail.info('SIGTERM empfangen. Server wird heruntergefahren...');
  try {
    await client.close(); // MongoDB-Verbindung schließen
    logtail.info('MongoDB-Verbindung erfolgreich geschlossen');
  } catch (error) {
    logtail.error('Fehler beim Schließen der MongoDB-Verbindung', { error: error.message });
  }
  process.exit(0); // Erfolgreich beenden
});

// Server starten
startServer();
