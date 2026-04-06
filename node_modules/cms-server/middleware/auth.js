export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header required' });
  }

  const token = authHeader.substring(7);
  const validRoles = ['author', 'editor'];
  
  if (!validRoles.includes(token)) {
    return res.status(401).json({ error: 'Invalid role' });
  }

  req.user = { role: token };
  next();
};

export const requireAuthor = (req, res, next) => {
  if (req.user.role !== 'author') {
    return res.status(403).json({ error: 'Author role required' });
  }
  next();
};

export const requireEditor = (req, res, next) => {
  if (req.user.role !== 'editor') {
    return res.status(403).json({ error: 'Editor role required' });
  }
  next();
};
