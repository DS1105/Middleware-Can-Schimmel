// Lade Umgebungsvariablen
require('dotenv').config({ path: '/Users/seracan/MT/Middleware-Can-Schimmel/.env' });

// Importiere Logtail für Logging
const { Logtail } = require('@logtail/node');
const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN);

// MongoDB-Verbindung
const { MongoClient } = require('mongodb');

// MongoDB-Konfigurationsvariablen
const url = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = 'shoppingDB';
const client = new MongoClient(url);

async function runMigrations() {
  try {
    logtail.info("Starte Datenbank-Migration...");

    // Verbinde mit MongoDB
    await client.connect();
    logtail.info("Mit MongoDB verbunden.");

    const db = client.db(dbName);

    // Beispiel: Neue Migration hinzufügen
    const shoppingCollection = db.collection('shoppingItems');
    const result = await shoppingCollection.updateMany(
      {}, 
      { $set: { createdAt: new Date() } } // Beispielmigration: `createdAt` hinzufügen
    );

    logtail.info("Migration abgeschlossen.", { modifiedCount: result.modifiedCount });
  } catch (error) {
    logtail.error("Fehler während der Migration.", { error: error.message });
    process.exit(1); // Skript bei Fehler beenden
  } finally {
    try {
      await client.close();
      logtail.info("MongoDB-Verbindung geschlossen.");
    } catch (closeError) {
      logtail.error("Fehler beim Schließen der MongoDB-Verbindung.", { error: closeError.message });
    }
  }
}

// Signalbehandlung (z. B. SIGTERM)
process.on('SIGTERM', async () => {
  logtail.info("SIGTERM empfangen, Migration wird beendet...");
  try {
    await client.close();
    logtail.info("MongoDB-Verbindung geschlossen.");
  } catch (closeError) {
    logtail.error("Fehler beim Schließen der MongoDB-Verbindung.", { error: closeError.message });
  }
  process.exit(0);
});

// Migration ausführen
runMigrations();
