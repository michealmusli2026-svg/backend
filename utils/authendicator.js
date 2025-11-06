import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // adjust path as needed

// Middleware to authenticate user and optionally check role
export const authenticate = (roles = []) => {
  // roles can be a single role string or an array of roles
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      // Check if role is allowed
      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ error: 'Access denied' });
      }

      req.user = user; // attach user to request
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token', details: err.message });
    }
  };
};
