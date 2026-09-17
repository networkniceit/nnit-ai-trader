const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  message: { error: "Too many requests" }
});

function applySecurity(app) {
  app.use(helmet());
  app.use(limiter);
}

module.exports = { applySecurity };