const { Logtail } = require('@logtail/node');

const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN);

module.exports = logtail;
