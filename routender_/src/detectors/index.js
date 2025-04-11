// src/detectors/index.js
const expressDetector = require('./express-detector');
const nextjsDetector = require('./nextjs-detector');
const fastifyDetector = require('./fastify-detector');
const koaDetector = require('./koa-detector');

module.exports = [
  expressDetector,
  nextjsDetector,
  fastifyDetector,
  koaDetector
];