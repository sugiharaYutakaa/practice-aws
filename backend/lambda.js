const awsServerlessExpress = require('aws-serverless-express');
const app = require('./index');
const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => {
    return awsServerlessExpress.proxy(server, event, context);
};
