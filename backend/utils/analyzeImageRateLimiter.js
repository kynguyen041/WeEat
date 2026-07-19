const rateLimit = require("express-rate-limit");
const AppError = require("./AppError");

const analyzeImageRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window per user
  standardHeaders: true, // RateLimit-* + Retry-After headers
  keyGenerator: (req) => req.user.id,
  handler: (req, res, next) =>
    next(new AppError("Rate limit exceeded. Please try again later.", 429)),
});

module.exports = analyzeImageRateLimiter;
