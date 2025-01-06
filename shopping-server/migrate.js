// Load Environment Variables
// Using `dotenv` to load variables from `.env` file.
// (12-Factor: Configuration is stored in the environment, not hardcoded)
require('dotenv').config({ path: '/Users/seracan/MT/Middleware-Can-Schimmel/.env' });

// Import Logtail for Logging
// Centralized structured logging for observability and debugging.
const { Logtail } = require('@logtail/node');
const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN); // (12-Factor: Externalized logging configuration)

// MongoDB Connection
// MongoDB client for database operations.
const { MongoClient } = require('mongodb');

// **MongoDB Configuration Variables**
// Environment-based configuration for flexibility in different environments.
const url = process.env.MONGO_URI || 'mongodb://localhost:27017'; // (12-Factor: Config via environment variables)
const dbName = 'shoppingDB'; // Database name
const client = new MongoClient(url); // MongoDB client instance

// Run Migrations
// Example migration script to update the database schema.
async function runMigrations() {
  try {
    logtail.info("Starting database migration...");

    // Connect to MongoDB
    await client.connect();
    logtail.info("Connected to MongoDB.");

    const db = client.db(dbName);

    // Example Migration: Adding `createdAt` field to all shopping items
    const shoppingCollection = db.collection('shoppingItems');
    const result = await shoppingCollection.updateMany(
      {}, 
      { $set: { createdAt: new Date() } } // Adding a `createdAt` timestamp
    );

    logtail.info("Migration completed.", { modifiedCount: result.modifiedCount });
  } catch (error) {
    logtail.error("Error during migration.", { error: error.message });
    process.exit(1); // Exit the script on failure
  } finally {
    try {
      await client.close(); // Close the MongoDB connection
      logtail.info("MongoDB connection closed.");
    } catch (closeError) {
      logtail.error("Error while closing MongoDB connection.", { error: closeError.message });
    }
  }
}

// Signal Handling (e.g., SIGTERM)
// Graceful handling of termination signals to ensure cleanup.
process.on('SIGTERM', async () => {
  logtail.info("SIGTERM received, shutting down migration...");
  try {
    await client.close(); // Close MongoDB connection
    logtail.info("MongoDB connection closed.");
  } catch (closeError) {
    logtail.error("Error while closing MongoDB connection.", { error: closeError.message });
  }
  process.exit(0); // Exit gracefully
});

// Execute Migrations
// Run the migration logic
runMigrations();
