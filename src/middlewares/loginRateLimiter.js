import rateLimit from "express-rate-limit";

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 5, // Limit each phone number to 5 requests per windowMs
  keyGenerator: (req) => req.body.phone, // Use the phone number as the key
  message: {
    status: 429,
    message:
      "Too many login attempts from this phone number. Please try again later.",
  },
});

export { loginRateLimiter };
