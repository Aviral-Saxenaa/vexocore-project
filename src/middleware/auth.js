const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate JWT tokens
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, secret);
    
    // Add user info to request object
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      username: decoded.username
    };
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    } else {
      return res.status(401).json({ error: 'Token verification failed' });
    }
  }
};

/**
 * Optional authentication middleware (doesn't fail if no token)
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const secret = process.env.JWT_SECRET || 'your-secret-key';
      const decoded = jwt.verify(token, secret);
      
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        username: decoded.username
      };
    } catch (error) {
      // Token is invalid, but we don't fail the request
      console.warn('Invalid token in optional auth:', error.message);
    }
  }
  
  next();
};

/**
 * Generate JWT token
 */
const generateToken = (payload, expiresIn = '24h') => {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  return jwt.sign(payload, secret, { expiresIn });
};

module.exports = {
  authenticateToken,
  optionalAuth,
  generateToken
};