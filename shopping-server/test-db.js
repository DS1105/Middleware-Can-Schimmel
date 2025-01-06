// Load Environment Variables
// Using `dotenv` to load environment-specific variables from `.env`.
// (12-Factor: Configuration stored in environment variables for flexibility)
require('dotenv').config({ path: '/Users/seracan/MT/Middleware-Can-Schimmel/.env' });

// Import Dependencies
const mongoose = require('mongoose'); // MongoDB ODM for schema-based data modeling.
const { Logtail } = require('@logtail/node'); // Logtail for structured logging.

// **Logtail Initialization**
// Logging setup using Logtail with a source token from environment variables.
// (12-Factor: Centralized, externalized logging configuration)
const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN);

// MongoDB Connection URI
// MongoDB URI from environment variables or fallback to localhost.
// (12-Factor: Environment-based configuration ensures adaptability across environments)
const dbUri = process.env.MONGO_URI || 'mongodb://localhost:27017/myDatabase';

// Database Connection with Logging
// Using Mongoose to establish a connection to MongoDB with proper logging for success and errors.
mongoose
  .connect(dbUri) // Connect to the database
  .then(() => {
    logtail.info("Database connected successfully", { dbUri }); // Log success
  })
  .catch((err) => {
    logtail.error("Error connecting to the database", { error: err.message }); // Log error
  });
