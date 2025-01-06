require('dotenv').config({ path: '/Users/seracan/MT/Middleware-Can-Schimmel/.env' }); 
// Load environment variables from the .env file (12-Factor: Config via environment variables)

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const { Logtail } = require('@logtail/node');

// Initialize Logtail for logging (12-Factor: Centralized logging)
const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN);

const app = express();
const port = process.env.PORT || 5001; // Set the server port from environment or default to 5001 (12-Factor: Config via environment variables)

app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(bodyParser.json()); // Parse incoming JSON requests

// MongoDB connection details
const url = process.env.MONGO_URI || 'mongodb://localhost:27017'; // MongoDB URI from environment or fallback (12-Factor: Config via environment variables)
const dbName = 'shoppingDB'; // Database name
const client = new MongoClient(url);

let shoppingCollection; // To store the MongoDB collection instance

async function startServer() {
  try {
    await client.connect(); // Connect to MongoDB (12-Factor: Backing services attached as resources)
    logtail.info('Connected to MongoDB');
    const db = client.db(dbName); // Access the database
    shoppingCollection = db.collection('shoppingItems'); // Access the collection

    // Start the Express server
    app.listen(port, () => {
      logtail.info(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    logtail.error('Error connecting to MongoDB', { error: error.message });
    process.exit(1); // Exit the process on database connection failure (12-Factor: Fail fast)
  }
}

// **1. Retrieve all shopping items**
app.get('/api/shoppingItems', async (req, res) => {
  try {
    logtail.info('GET /api/shoppingItems called');
    const items = await shoppingCollection.find({}).toArray(); // Fetch all items from the collection
    res.json(items); // Respond with the items
  } catch (error) {
    logtail.error('Error fetching items', { error: error.message });
    res.status(500).send('Error fetching items'); // Handle errors with a 500 response
  }
});

// **2. Retrieve a single shopping item by ID**
app.get('/api/shoppingItems/:id', async (req, res) => {
  try {
    logtail.info(`GET /api/shoppingItems/${req.params.id} called`);
    if (!ObjectId.isValid(req.params.id)) {
      // Validate the ID format
      logtail.warn('Invalid ID provided', { id: req.params.id });
      return res.status(400).send('Invalid ID'); // Respond with a 400 for bad requests
    }
    const item = await shoppingCollection.findOne({ _id: new ObjectId(req.params.id) }); // Find item by ID
    if (item) {
      res.json(item); // Respond with the found item
    } else {
      res.status(404).send('Item not found'); // Handle item not found with a 404 response
    }
  } catch (error) {
    logtail.error('Error fetching item by ID', { error: error.message });
    res.status(500).send('Error fetching item'); // Handle errors with a 500 response
  }
});

// **3. Add a new shopping item**
app.post('/api/shoppingItems', async (req, res) => {
  try {
    logtail.info('POST /api/shoppingItems called', { body: req.body });
    const { name, amount } = req.body; // Destructure the request body
    if (!name || amount == null) {
      // Validate the request body
      logtail.warn('Invalid request: Name and amount required', { body: req.body });
      return res.status(400).send('Invalid request: Name and amount required');
    }

    const result = await shoppingCollection.insertOne({ name, amount }); // Insert a new item
    res.status(201).json({ _id: result.insertedId, name, amount }); // Respond with the created item
  } catch (error) {
    logtail.error('Error adding item', { error: error.message });
    res.status(500).send('Error adding item'); // Handle errors with a 500 response
  }
});

// **4. Update a shopping item by ID**
app.put('/api/shoppingItems/:id', async (req, res) => {
  try {
    logtail.info(`PUT /api/shoppingItems/${req.params.id} called`, { body: req.body });
    if (!ObjectId.isValid(req.params.id)) {
      // Validate the ID format
      logtail.warn('Invalid ID provided', { id: req.params.id });
      return res.status(400).send('Invalid ID'); // Respond with a 400 for bad requests
    }

    const { name, amount } = req.body; // Destructure the request body
    if (!name || amount == null) {
      // Validate the request body
      logtail.warn('Invalid request: Name and amount required', { body: req.body });
      return res.status(400).send('Invalid request: Name and amount required');
    }

    const result = await shoppingCollection.updateOne(
      { _id: new ObjectId(req.params.id) }, // Find item by ID
      { $set: { name, amount } } // Update fields
    );

    if (result.matchedCount === 0) {
      return res.status(404).send('Item not found'); // Handle item not found with a 404 response
    }

    res.json({ message: 'Item updated' }); // Respond with success message
  } catch (error) {
    logtail.error('Error updating item', { error: error.message });
    res.status(500).send('Error updating item'); // Handle errors with a 500 response
  }
});

// **5. Delete a shopping item by ID**
app.delete('/api/shoppingItems/:id', async (req, res) => {
  try {
    logtail.info(`DELETE /api/shoppingItems/${req.params.id} called`);
    if (!ObjectId.isValid(req.params.id)) {
      // Validate the ID format
      logtail.warn('Invalid ID provided', { id: req.params.id });
      return res.status(400).send('Invalid ID'); // Respond with a 400 for bad requests
    }

    const result = await shoppingCollection.deleteOne({ _id: new ObjectId(req.params.id) }); // Delete item by ID
    if (result.deletedCount === 0) {
      return res.status(404).send('Item not found'); // Handle item not found with a 404 response
    }

    res.send('Item deleted'); // Respond with success message
  } catch (error) {
    logtail.error('Error deleting item', { error: error.message });
    res.status(500).send('Error deleting item'); // Handle errors with a 500 response
  }
});

// Graceful Shutdown - Handle SIGINT and SIGTERM signals
process.on('SIGTERM', async () => {
  logtail.info('SIGTERM received. Shutting down server...');
  try {
    await client.close(); // Close MongoDB connection (12-Factor: Disposable processes)
    logtail.info('MongoDB connection closed successfully');
  } catch (error) {
    logtail.error('Error closing MongoDB connection', { error: error.message });
  }
  process.exit(0); // Exit the process gracefully
});

// Start the server
startServer(); // Start the application (12-Factor: Stateless processes)

