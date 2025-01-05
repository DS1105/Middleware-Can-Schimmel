require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

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
    console.log('Mit MongoDB verbunden');
    const db = client.db(dbName);
    shoppingCollection = db.collection('shoppingItems');

    app.listen(port, () => {
      console.log(`Server läuft unter http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Fehler beim Verbinden mit MongoDB:', error);
    process.exit(1); // Beende den Prozess bei Verbindungsfehlern
  }
}

// **1. Alle Artikel abrufen**
app.get('/api/shoppingItems', async (req, res) => {
  try {
    const items = await shoppingCollection.find({}).toArray();
    res.json(items);
  } catch (error) {
    console.error('Fehler beim Abrufen der Artikel:', error);
    res.status(500).send('Fehler beim Abrufen der Artikel');
  }
});

// **2. Einzelnen Artikel abrufen**
app.get('/api/shoppingItems/:id', async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).send('Ungültige ID');
    }
    const item = await shoppingCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (item) {
      res.json(item);
    } else {
      res.status(404).send('Artikel nicht gefunden');
    }
  } catch (error) {
    console.error('Fehler beim Abrufen des Artikels:', error);
    res.status(500).send('Fehler beim Abrufen des Artikels');
  }
});

// **3. Artikel hinzufügen**
app.post('/api/shoppingItems', async (req, res) => {
  try {
    const { name, amount } = req.body;
    if (!name || amount == null) {
      return res.status(400).send('Ungültige Anfrage: Name und Anzahl erforderlich');
    }

    const result = await shoppingCollection.insertOne({ name, amount });
    res.status(201).json({ _id: result.insertedId, name, amount });
  } catch (error) {
    console.error('Fehler beim Hinzufügen des Artikels:', error);
    res.status(500).send('Fehler beim Hinzufügen des Artikels1');
  }
});

// **4. Artikel aktualisieren**
app.put('/api/shoppingItems/:id', async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).send('Ungültige ID');
    }

    const { name, amount } = req.body;
    if (!name || amount == null) {
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
    console.error('Fehler beim Aktualisieren des Artikels:', error);
    res.status(500).send('Fehler beim Aktualisieren des Artikels');
  }
});

// **5. Artikel löschen**
app.delete('/api/shoppingItems/:id', async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).send('Ungültige ID');
    }

    const result = await shoppingCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).send('Artikel nicht gefunden');
    }

    res.send('Artikel gelöscht');
  } catch (error) {
    console.error('Fehler beim Löschen des Artikels:', error);
    res.status(500).send('Fehler beim Löschen des Artikels');
  }
});

// Graceful Shutdown
process.on('SIGINT', async () => {
  console.log('Server wird heruntergefahren...');
  try {
    await client.close();
    console.log('MongoDB-Verbindung geschlossen');
  } catch (error) {
    console.error('Fehler beim Schließen der MongoDB-Verbindung:', error);
  }
  process.exit();
});

// Server starten
startServer();
