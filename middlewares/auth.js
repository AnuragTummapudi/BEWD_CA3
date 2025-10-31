// middlewares/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const apiKey = req.headers['x-api-key'];

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: payload.id, username: payload.username, isAdmin: !!payload.isAdmin };
        return next();
      } catch (e) {
        return res.status(401).json({ error: 'Invalid JWT token.' });
      }
    }

    if (apiKey) {
      // admin key
      if (apiKey === process.env.ADMIN_KEY) {
        req.user = { id: 'admin', username: 'admin', isAdmin: true };
        return next();
      }
      if (apiKey === process.env.API_KEY) {
        const userId = req.headers['x-user-id'];
        if (!userId) return res.status(401).json({ error: 'Missing x-user-id header for API key auth.' });
        req.user = { id: String(userId), username: String(userId), isAdmin: false };
        return next();
      }
      return res.status(401).json({ error: 'Invalid API key.' });
    }

    return res.status(401).json({ error: 'No authentication provided. Use Authorization Bearer <token> or x-api-key header.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Auth middleware error' });
  }
};