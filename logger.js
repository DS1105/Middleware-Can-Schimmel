// Import Logtail for structured logging
const { Logtail } = require('@logtail/node');

// Initialize Logtail instance with a token from environment variables
// (12-Factor: Configured via environment variables for portability)
const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN);

// Export Logtail instance for reuse in other parts of the application
// (12-Factor: Codebase modularity)
module.exports = logtail;
