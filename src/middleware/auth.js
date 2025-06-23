const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key'; // coloque no .env depois!

module.exports = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'Token não fornecido' });

  try {
    const decoded = jwt.verify(token.split(' ')[1], SECRET_KEY);
    req.userId = decoded.id;
    req.userRole = decoded.tipo;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: 'Token inválido' });
  }
};
