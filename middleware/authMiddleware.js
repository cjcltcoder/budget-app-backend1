const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  try {
    // Retrieve the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Authentication failed: Token missing or invalid');
    }
    const token = authHeader.split(' ')[1];
    // Verify the token
    const decodedToken = jwt.verify(token, 'unbreakable key');
    // Attach user data to the request object
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed', error: error.message });
  }
};

module.exports = { requireAuth };
